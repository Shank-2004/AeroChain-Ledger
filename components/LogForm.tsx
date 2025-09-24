
import React, { useState } from 'react';
import type { MaintenanceRecord, Block } from '../types';

interface LogFormProps {
  onClose: () => void;
  onSubmit: (record: Omit<MaintenanceRecord, 'id'>) => Promise<void>;
  latestBlock: Block;
}

export const LogForm: React.FC<LogFormProps> = ({ onClose, onSubmit, latestBlock }) => {
  const [aircraftId, setAircraftId] = useState('AC-747-X');
  const [engineerName, setEngineerName] = useState('Jane Doe');
  const [actionTaken, setActionTaken] = useState('');
  const [partsReplaced, setPartsReplaced] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionTaken.trim()) {
        alert("Action Taken field cannot be empty.");
        return;
    }
    
    setIsSubmitting(true);
    const newRecord: Omit<MaintenanceRecord, 'id'> = {
      aircraftId,
      maintenanceDate: new Date().toISOString(),
      engineerName,
      actionTaken,
      partsReplaced: partsReplaced.split(',').map(p => p.trim()).filter(p => p),
    };
    await onSubmit(newRecord);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity">
      <div className="bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700 w-full max-w-lg m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-cyan-400">Add New Maintenance Log</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
        </div>
        <p className="text-sm text-slate-400 mb-2">Creating Block #{latestBlock.index + 1}</p>
        <p className="text-sm text-slate-400 mb-6 break-all">Previous Block Hash: <span className="font-mono text-cyan-300 text-xs">{latestBlock.hash}</span></p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Aircraft ID</label>
              <input type="text" value={aircraftId} onChange={(e) => setAircraftId(e.target.value)} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Engineer Name</label>
              <input type="text" value={engineerName} onChange={(e) => setEngineerName(e.target.value)} required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Action Taken</label>
              <textarea value={actionTaken} onChange={(e) => setActionTaken(e.target.value)} required rows={3} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g., Replaced starboard engine turbine blades"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Parts Replaced (comma-separated)</label>
              <input type="text" value={partsReplaced} onChange={(e) => setPartsReplaced(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g., part-no-123, part-no-456"/>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="py-2 px-4 bg-slate-600 hover:bg-slate-700 rounded-md transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="py-2 px-4 bg-cyan-500 hover:bg-cyan-600 rounded-md transition-colors font-semibold disabled:bg-cyan-800 disabled:cursor-not-allowed">
              {isSubmitting ? 'Adding to Chain...' : 'Create Block'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

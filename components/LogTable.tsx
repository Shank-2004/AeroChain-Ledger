
import React, { useState } from 'react';
import type { Block } from '../types';
import { QRCodeCanvas } from './QrCode';

interface LogTableProps {
  chain: Block[];
}

const LogEntry: React.FC<{ block: Block }> = ({ block }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const qrData = JSON.stringify({
    block: block.index,
    aircraft: block.data.aircraftId,
    date: block.data.maintenanceDate,
    hash: block.hash
  }, null, 2);

  const blockClass = "bg-slate-800 hover:bg-slate-700/50";

  return (
    <>
      <tr 
        onClick={() => setIsExpanded(!isExpanded)} 
        className={`border-b border-slate-700 cursor-pointer transition-colors ${blockClass}`}
      >
        <td className="p-4 font-mono text-cyan-400">{block.index}</td>
        <td className="p-4">{block.data.aircraftId}</td>
        <td className="p-4 hidden md:table-cell">{new Date(block.timestamp).toLocaleString()}</td>
        <td className="p-4">{block.data.engineerName}</td>
        <td className="p-4 hidden lg:table-cell truncate max-w-xs">{block.data.actionTaken}</td>
      </tr>
      {isExpanded && (
        <tr className="bg-slate-800/50">
          <td colSpan={5} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h4 className="font-bold text-cyan-300">Action Taken</h4>
                  <p className="text-slate-300">{block.data.actionTaken}</p>
                </div>
                <div>
                  <h4 className="font-bold text-cyan-300">Parts Replaced</h4>
                  <p className="text-slate-300">
                    {block.data.partsReplaced.length > 0 ? block.data.partsReplaced.join(', ') : 'None'}
                  </p>
                </div>
                <div className="font-mono text-xs space-y-2 pt-4">
                  <p className="flex flex-col">
                    <span className="text-slate-400">HASH:</span>
                    <span className="text-green-400 break-all">{block.hash}</span>
                  </p>
                  <p className="flex flex-col">
                    <span className="text-slate-400">PREVIOUS HASH:</span>
                    <span className="text-yellow-400 break-all">{block.previousHash}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center bg-slate-900 p-4 rounded-lg">
                <QRCodeCanvas text={qrData} />
                <p className="text-xs text-slate-400 mt-2">Scan for details</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export const LogTable: React.FC<LogTableProps> = ({ chain }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
          <tr>
            <th scope="col" className="p-4">Block #</th>
            <th scope="col" className="p-4">Aircraft ID</th>
            <th scope="col" className="p-4 hidden md:table-cell">Timestamp</th>
            <th scope="col" className="p-4">Engineer</th>
            <th scope="col" className="p-4 hidden lg:table-cell">Action Taken</th>
          </tr>
        </thead>
        <tbody>
          {chain.slice().reverse().map(block => (
            <LogEntry 
              key={block.index} 
              block={block} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};


import React from 'react';
import type { Block } from '../types';

interface HistoryBlockCardProps {
  block: Block;
}

export const HistoryBlockCard: React.FC<HistoryBlockCardProps> = ({ block }) => {
  const isGenesis = block.index === 0;

  return (
    <div className="bg-slate-800/70 rounded-lg p-4 border border-slate-700">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-cyan-400">
          {isGenesis ? 'Genesis Block' : `Block #${block.index}`}
        </h3>
        <span className="text-xs text-slate-400">{new Date(block.timestamp).toLocaleString()}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <div>
          <p className="font-semibold text-slate-300">Aircraft ID:</p>
          <p className="text-slate-200">{block.data.aircraftId}</p>
        </div>
        <div>
          <p className="font-semibold text-slate-300">Engineer:</p>
          <p className="text-slate-200">{block.data.engineerName}</p>
        </div>
        <div className="md:col-span-2">
          <p className="font-semibold text-slate-300">Action Taken:</p>
          <p className="text-slate-200">{block.data.actionTaken}</p>
        </div>
        <div className="md:col-span-2">
          <p className="font-semibold text-slate-300">Parts Replaced:</p>
          <p className="text-slate-200">
            {block.data.partsReplaced.length > 0 ? block.data.partsReplaced.join(', ') : 'None'}
          </p>
        </div>
      </div>

      <div className="font-mono text-xs space-y-2 mt-4 pt-3 border-t border-slate-700">
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
  );
};

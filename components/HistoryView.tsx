
import React, { useState } from 'react';
import type { Block } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { WarningIcon } from './icons/WarningIcon';
import { HistoryBlockCard } from './HistoryBlockCard';

interface HistoryViewProps {
    chain: Block[];
    isValid: boolean | null;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ chain, isValid }) => {
    const [copySuccess, setCopySuccess] = useState('');
    
    const lastMaintenanceDate = chain.length > 1 
        ? new Date(chain[chain.length - 1].timestamp).toLocaleDateString() 
        : 'N/A';
    
    const totalRecords = chain.length - 1; // Excluding Genesis Block

    const copyToClipboard = () => {
        const jsonString = JSON.stringify(chain, null, 2);
        navigator.clipboard.writeText(jsonString).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Failed to copy');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    const getValidityStatus = () => {
        if (isValid === null) {
            return { text: 'Not Yet Verified', icon: <WarningIcon className="w-6 h-6 text-yellow-400" />, color: 'text-yellow-400'};
        }
        if (isValid) {
            return { text: 'Chain Integrity Valid', icon: <CheckIcon className="w-6 h-6 text-green-400" />, color: 'text-green-400'};
        }
        return { text: 'Chain Invalid!', icon: <WarningIcon className="w-6 h-6 text-red-400" />, color: 'text-red-400'};
    }
    
    const validity = getValidityStatus();

    return (
        <div>
            <h1 className="text-3xl font-bold text-cyan-400 mb-6">Chain History & Stats</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-700/50 p-6 rounded-lg">
                    <h2 className="text-sm font-bold text-slate-400 uppercase">Total Records</h2>
                    <p className="text-3xl font-semibold text-white mt-1">{totalRecords}</p>
                </div>
                <div className="bg-slate-700/50 p-6 rounded-lg">
                    <h2 className="text-sm font-bold text-slate-400 uppercase">Last Maintenance</h2>
                    <p className="text-3xl font-semibold text-white mt-1">{lastMaintenanceDate}</p>
                </div>
                <div className={`bg-slate-700/50 p-6 rounded-lg flex items-center gap-4 ${validity.color}`}>
                    {validity.icon}
                    <div>
                        <h2 className="text-sm font-bold text-slate-400 uppercase">Chain Status</h2>
                        <p className="text-xl font-semibold text-white mt-1">{validity.text}</p>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-cyan-400">Detailed Ledger</h2>
                    <button
                        onClick={copyToClipboard}
                        className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                        {copySuccess || 'Copy Raw JSON'}
                    </button>
                </div>
                <div className="space-y-4 max-h-[32rem] overflow-y-auto p-2 border border-slate-800 rounded-lg">
                   {chain.slice().reverse().map(block => (
                       <HistoryBlockCard key={block.index} block={block} />
                   ))}
                </div>
            </div>
        </div>
    );
};


import React from 'react';
import { WarningIcon } from './icons/WarningIcon';

interface BackendStatusProps {
  status: 'connecting' | 'connected' | 'error';
}

export const BackendStatus: React.FC<BackendStatusProps> = ({ status }) => {
  if (status === 'connecting') {
    return (
      <div className="flex items-center gap-2 text-sm text-yellow-300">
        <div className="w-3 h-3 border-2 border-t-transparent border-yellow-300 rounded-full animate-spin"></div>
        <span>Connecting to Node.js...</span>
      </div>
    );
  }
  
  if (status === 'error') {
    return (
        <div className="flex items-center gap-2 text-sm text-red-400">
            <WarningIcon className="w-4 h-4" />
            <span>Connection Error</span>
        </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-400">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </span>
      <span>Connected to Node.js</span>
    </div>
  );
};

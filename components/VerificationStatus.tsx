
import React from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { WarningIcon } from './icons/WarningIcon';

interface VerificationStatusProps {
  isValid: boolean | null;
  isVerifying: boolean;
  onVerify: () => void;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({ isValid, isVerifying, onVerify }) => {
  const getStatus = () => {
    if (isVerifying) {
      return {
        text: 'Verifying...',
        icon: <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>,
        color: 'bg-blue-500',
        textColor: 'text-blue-200'
      };
    }
    if (isValid === null) {
      return {
        text: 'Pending Verification',
        icon: <WarningIcon className="w-4 h-4" />,
        color: 'bg-yellow-500/80',
        textColor: 'text-yellow-200'
      };
    }
    if (isValid) {
      return {
        text: 'Chain Integrity Valid',
        icon: <CheckIcon className="w-4 h-4" />,
        color: 'bg-green-500/80',
        textColor: 'text-green-200'
      };
    }
    return {
      text: 'Chain Integrity Invalid!',
      icon: <WarningIcon className="w-4 h-4" />,
      color: 'bg-red-500/80',
      textColor: 'text-red-200'
    };
  };

  const { text, icon, color, textColor } = getStatus();

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-2 py-1 px-3 rounded-full text-xs font-semibold ${color} ${textColor}`}>
        {icon}
        <span>{text}</span>
      </div>
      <button
        onClick={onVerify}
        disabled={isVerifying}
        className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm disabled:opacity-50"
      >
        Verify Chain
      </button>
    </div>
  );
};

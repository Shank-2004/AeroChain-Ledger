
import React from 'react';
import { PlaneIcon } from './icons/PlaneIcon';
import { BackendStatus } from './BackendStatus';

type View = 'ledger' | 'history';

interface HeaderProps {
    connectionStatus: 'connecting' | 'connected' | 'error';
    currentView: View;
    onNavigate: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ connectionStatus, currentView, onNavigate }) => {
  const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeLinkClasses = "bg-cyan-500 text-white";
  const inactiveLinkClasses = "text-slate-300 hover:bg-slate-700 hover:text-white";

  return (
    <header className="bg-slate-900/60 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-50">
      <nav className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <PlaneIcon className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold text-white">AeroChain</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => onNavigate('ledger')} 
              className={`${navLinkClasses} ${currentView === 'ledger' ? activeLinkClasses : inactiveLinkClasses}`}
            >
              Ledger
            </button>
            <button 
              onClick={() => onNavigate('history')}
              className={`${navLinkClasses} ${currentView === 'history' ? activeLinkClasses : inactiveLinkClasses}`}
            >
              History
            </button>
          </div>
        </div>
        <div className="hidden md:block">
          <BackendStatus status={connectionStatus} />
        </div>
      </nav>
    </header>
  );
};

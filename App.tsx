
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { LogForm } from './components/LogForm';
import { LogTable } from './components/LogTable';
import { VerificationStatus } from './components/VerificationStatus';
import { useBlockchain } from './hooks/useBlockchain';
import { BackendStatus } from './components/BackendStatus';
import { HistoryView } from './components/HistoryView';
import { WarningIcon } from './components/icons/WarningIcon';
import type { MaintenanceRecord } from './types';

type View = 'ledger' | 'history';

const App: React.FC = () => {
  const { chain, isChainValid, addBlock, validateChain, isLoading, connectionStatus } = useBlockchain();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentView, setCurrentView] = useState<View>('ledger');

  const handleAddRecord = async (record: Omit<MaintenanceRecord, 'id'>) => {
    const success = await addBlock(record);
    if (success) {
      setIsFormOpen(false);
    } else {
      alert("Failed to add the record. Please check the connection to the backend.");
    }
  };

  const handleVerifyChain = useCallback(async () => {
    setIsVerifying(true);
    await validateChain();
    setIsVerifying(false);
  }, [validateChain]);
  
  const renderLedgerView = () => (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-cyan-400">Maintenance Ledger</h1>
        <div className="flex items-center gap-4">
          <VerificationStatus isValid={isChainValid} isVerifying={isVerifying} onVerify={handleVerifyChain} />
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md"
          >
            Add New Record
          </button>
        </div>
      </div>

      <p className="text-slate-400 mb-6 max-w-3xl">
        This ledger represents an immutable chain of maintenance records stored in your browser. Each new record is a "block" cryptographically linked to the previous one.
      </p>

      <LogTable chain={chain} />
    </>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64 flex-col">
          <div className="w-8 h-8 border-4 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-300">Loading blockchain from ledger...</p>
        </div>
      );
    }

    if (connectionStatus === 'error') {
      return (
          <div className="flex justify-center items-center h-64 flex-col text-center">
            <WarningIcon className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-400 mb-2">Connection Failed</h2>
            <p className="text-slate-300 max-w-md">
              Could not connect to the Node.js backend. Please ensure the server is running and accessible. The frontend is trying to reach endpoints under `/api/`.
            </p>
          </div>
      );
    }
    
    return currentView === 'ledger' 
      ? renderLedgerView() 
      : <HistoryView chain={chain} isValid={isChainValid} />;
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <Header 
        connectionStatus={connectionStatus} 
        currentView={currentView}
        onNavigate={setCurrentView}
      />
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-slate-700">
           <div className="md:hidden flex justify-center mb-4">
              <BackendStatus status={connectionStatus} />
           </div>
          {renderContent()}
        </div>
      </main>
      {isFormOpen && !isLoading && chain.length > 0 && (
        <LogForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddRecord}
          latestBlock={chain[chain.length-1]}
        />
      )}
    </div>
  );
};

export default App;


import { useState, useEffect, useCallback } from 'react';
import type { Block, MaintenanceRecord } from '../types';
import { fetchChain, postNewBlock, fetchChainValidation } from '../services/blockchainService';

type ConnectionStatus = 'connecting' | 'connected' | 'error';

export const useBlockchain = () => {
  const [chain, setChain] = useState<Block[]>([]);
  const [isChainValid, setIsChainValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');

  useEffect(() => {
    const initializeChain = async () => {
      try {
        const remoteChain = await fetchChain();
        setChain(remoteChain);
        setConnectionStatus('connected');
      } catch (error) {
        console.error("Initialization failed:", error);
        setConnectionStatus('error');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeChain();
  }, []);

  const addBlock = useCallback(async (record: Omit<MaintenanceRecord, 'id'>) => {
    try {
      const newBlock = await postNewBlock(record);
      setChain(prevChain => [...prevChain, newBlock]);
      setIsChainValid(null); // Adding a block requires re-validation
      return true;
    } catch (error) {
      console.error("Failed to add block:", error);
      return false;
    }
  }, []);

  const validateChain = useCallback(async () => {
    try {
      const { isValid } = await fetchChainValidation();
      setIsChainValid(isValid);
    } catch (error) {
      console.error("Failed to validate chain:", error);
      setIsChainValid(false);
    }
  }, []);

  return {
    chain,
    isChainValid,
    isLoading,
    connectionStatus,
    addBlock,
    validateChain,
  };
};

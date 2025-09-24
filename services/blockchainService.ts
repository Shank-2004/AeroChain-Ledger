import type { Block, MaintenanceRecord } from '../types';

// --- LOCAL STORAGE PERSISTENCE ---

const CHAIN_STORAGE_KEY = 'aerochain_ledger';

// A simple function to simulate creating a cryptographic hash. In a real app, this would be a robust library like SHA-256.
const mockHash = (data: any): string => {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return 'mock-hash-' + Math.abs(hash).toString(16) + str.length;
};

// Creates the very first block in the chain.
const createGenesisBlock = (): Block => {
    const genesisRecord: MaintenanceRecord = {
        id: 'genesis_id',
        aircraftId: 'N/A',
        maintenanceDate: new Date('2023-01-01T00:00:00.000Z').toISOString(),
        engineerName: 'System',
        actionTaken: 'Ledger Initialized - Genesis Block',
        partsReplaced: [],
    };
    const timestamp = new Date('2023-01-01T00:00:00.000Z').getTime();
    const hash = mockHash({ data: genesisRecord, timestamp, previousHash: '0', index: 0 });
    
    return {
        index: 0,
        timestamp,
        data: genesisRecord,
        previousHash: '0',
        hash,
    };
};

const getChainFromStorage = (): Block[] => {
    const storedChain = localStorage.getItem(CHAIN_STORAGE_KEY);
    if (storedChain) {
        return JSON.parse(storedChain);
    }
    // If no chain exists, create one with a genesis block and save it.
    const newChain = [createGenesisBlock()];
    localStorage.setItem(CHAIN_STORAGE_KEY, JSON.stringify(newChain));
    return newChain;
};

// --- MOCKED API FUNCTIONS USING LOCAL STORAGE ---

const simulateNetworkDelay = (delay = 500) => new Promise(resolve => setTimeout(resolve, delay));

/**
 * Fetches the entire blockchain from Local Storage.
 */
export async function fetchChain(): Promise<Block[]> {
    console.log("MOCK API: Fetching chain from Local Storage...");
    await simulateNetworkDelay(1000);
    return Promise.resolve(getChainFromStorage());
}

/**
 * Creates a new block and saves it to Local Storage.
 */
export async function postNewBlock(record: Omit<MaintenanceRecord, 'id'>): Promise<Block> {
    console.log("MOCK API: Posting new block to Local Storage...");
    await simulateNetworkDelay();
    
    const currentChain = getChainFromStorage();
    const previousBlock = currentChain[currentChain.length - 1];
    const newIndex = previousBlock.index + 1;
    const timestamp = new Date().getTime();
    
    const newBlockData: MaintenanceRecord = {
        ...record,
        id: `rec_${newIndex}`
    };

    const newBlock: Block = {
        index: newIndex,
        timestamp,
        data: newBlockData,
        previousHash: previousBlock.hash,
        hash: mockHash({ data: newBlockData, timestamp, previousHash: previousBlock.hash, index: newIndex }),
    };
    
    const updatedChain = [...currentChain, newBlock];
    localStorage.setItem(CHAIN_STORAGE_KEY, JSON.stringify(updatedChain));

    return Promise.resolve(newBlock);
}

/**
 * Validates the integrity of the chain stored in Local Storage.
 */
export async function fetchChainValidation(): Promise<{ isValid: boolean }> {
    console.log("MOCK API: Validating chain from Local Storage...");
    await simulateNetworkDelay(1500);
    
    const chain = getChainFromStorage();

    for (let i = 1; i < chain.length; i++) {
        const currentBlock = chain[i];
        const previousBlock = chain[i - 1];

        // Check if the previous hash matches
        if (currentBlock.previousHash !== previousBlock.hash) {
            console.error(`Validation Failed: Block ${currentBlock.index} previousHash does not match Block ${previousBlock.index} hash.`);
            return Promise.resolve({ isValid: false });
        }

        // Check if the block's own hash is valid
        const recomputedHash = mockHash({
            data: currentBlock.data,
            timestamp: currentBlock.timestamp,
            previousHash: currentBlock.previousHash,
            index: currentBlock.index
        });
        if (currentBlock.hash !== recomputedHash) {
            console.error(`Validation Failed: Block ${currentBlock.index} hash is invalid.`);
            return Promise.resolve({ isValid: false });
        }
    }
    
    return Promise.resolve({ isValid: true });
}

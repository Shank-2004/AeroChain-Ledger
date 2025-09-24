
export interface MaintenanceRecord {
  id: string; // Typically a hash of the content
  aircraftId: string;
  maintenanceDate: string;
  engineerName: string;
  actionTaken: string;
  partsReplaced: string[];
}

export interface Block {
  index: number;
  timestamp: number;
  data: MaintenanceRecord;
  previousHash: string;
  hash: string;
}

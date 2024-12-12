export interface Tool {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'checked-out';
  serialNumber: string;
  category: string;
  checkoutInfo?: {
    technicianName: string;
    expectedLocation: string;
    checkoutDate: Date;
    expectedReturnDate: Date;
  };
}

export interface ToolHistory {
  id: string;
  toolId: string;
  action: 'check-in' | 'check-out';
  date: Date;
  technicianName: string;
  expectedLocation?: string;
  expectedReturnDate?: Date;
  notes?: string;
}
import React, { useState } from 'react';
import { Tool, ToolHistory } from './types/tool';
import { ToolForm } from './components/ToolForm';
import { ToolList } from './components/ToolList';
import { ToolHistoryList } from './components/ToolHistory';
import { Wrench } from 'lucide-react';

function App() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [history, setHistory] = useState<ToolHistory[]>([]);

  const handleAddTool = (toolData: Omit<Tool, 'id' | 'status'>) => {
    const newTool: Tool = {
      ...toolData,
      id: crypto.randomUUID(),
      status: 'available',
    };
    setTools([...tools, newTool]);
  };

  const handleStatusChange = (
    toolId: string,
    checkoutInfo?: {
      technicianName: string;
      expectedLocation: string;
      expectedReturnDate: Date;
      notes?: string;
    }
  ) => {
    setTools(tools.map(tool => {
      if (tool.id === toolId) {
        const newStatus = tool.status === 'available' ? 'checked-out' : 'available';
        
        // Add history entry
        const historyEntry: ToolHistory = {
          id: crypto.randomUUID(),
          toolId,
          action: newStatus === 'available' ? 'check-in' : 'check-out',
          date: new Date(),
          technicianName: checkoutInfo?.technicianName || tool.checkoutInfo?.technicianName || 'Unknown',
          expectedLocation: checkoutInfo?.expectedLocation,
          expectedReturnDate: checkoutInfo?.expectedReturnDate,
          notes: checkoutInfo?.notes,
        };
        setHistory([historyEntry, ...history]);
        
        return {
          ...tool,
          status: newStatus,
          checkoutInfo: newStatus === 'checked-out'
            ? {
                technicianName: checkoutInfo!.technicianName,
                expectedLocation: checkoutInfo!.expectedLocation,
                checkoutDate: new Date(),
                expectedReturnDate: checkoutInfo!.expectedReturnDate,
              }
            : undefined,
        };
      }
      return tool;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Wrench className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Tool Manager</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <ToolForm onSubmit={handleAddTool} />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <ToolList tools={tools} onStatusChange={handleStatusChange} />
            <ToolHistoryList history={history} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
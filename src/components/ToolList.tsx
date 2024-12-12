import React, { useState, useEffect } from 'react';
import { Tool, ToolHistory } from '../types/tool';
import { ToolCard } from './tool/ToolCard';

interface ToolListProps {
  onStatusChange: (toolId: string) => void;
}

export function ToolList({ onStatusChange }: ToolListProps) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [toolHistory, setToolHistory] = useState<ToolHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tools from the json-server API
  useEffect(() => {
    async function fetchTools() {
      try {
        const response = await fetch('http://localhost:5000/tools');
        if (!response.ok) {
          throw new Error('Failed to fetch tools');
        }
        const data = await response.json();
        setTools(data);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    async function fetchHistory() {
      try {
        const response = await fetch('http://localhost:5000/toolHistory');
        if (!response.ok) {
          throw new Error('Failed to fetch tool history');
        }
        const data = await response.json();
        setToolHistory(data);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred while fetching history');
      }
    }

    fetchTools();
    fetchHistory();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Função para alterar o status da ferramenta e registrar no histórico
  const handleStatusChange = async (toolId: string) => {
    try {
      // Encontra a ferramenta que será alterada
      const toolToUpdate = tools.find((tool) => tool.id === toolId);
      if (!toolToUpdate) {
        throw new Error('Tool not found');
      }

      // Alterna o status entre 'available' e 'checked-out'
      const newStatus: 'available' | 'checked-out' = toolToUpdate.status === 'available' ? 'checked-out' : 'available';

      // Atualiza o estado local imediatamente para refletir a mudança de status
      const updatedTools = tools.map((tool) =>
        tool.id === toolId ? { ...tool, status: newStatus } : tool
      );
      setTools(updatedTools);

      // Registra a mudança no histórico
      const historyEntry: ToolHistory = {
        id: `${toolId}-${new Date().toISOString()}`,
        toolId,
        action: newStatus === 'checked-out' ? 'check-out' : 'check-in',
        date: new Date(),
        technicianName: 'Technician Name', // Substitua conforme necessário
        expectedLocation: toolToUpdate.checkoutInfo?.expectedLocation,
        expectedReturnDate: toolToUpdate.checkoutInfo?.expectedReturnDate,
        notes: `Tool status changed to ${newStatus}`,
      };

      // Atualiza o histórico na API
      const response = await fetch('http://localhost:5000/toolHistory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(historyEntry),
      });

      if (!response.ok) {
        throw new Error('Failed to update tool history');
      }

      // Atualiza a ferramenta no json-server
      const updateResponse = await fetch(`http://localhost:5000/tools/${toolId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update tool status in the API');
      }

      // Chama a função onStatusChange para informar ao componente pai
      onStatusChange(toolId);
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Tool Inventory</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {tools.map((tool) => (
          <div key={tool.id}>
            <ToolCard tool={tool} onStatusChange={handleStatusChange} />
          </div>
        ))}
      </div>
    </div>
  );
}

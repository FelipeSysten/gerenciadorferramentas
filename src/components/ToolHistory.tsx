import React, { useEffect, useState } from 'react';
import { ToolHistory } from '../types/tool';
import { History } from 'lucide-react';
import { HistoryEntry } from './history/HistoryEntry';

interface ToolHistoryListProps {}

export function ToolHistoryList({}: ToolHistoryListProps) {
  const [history, setHistory] = useState<ToolHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('http://localhost:5000/toolHistory');
        if (!response.ok) {
          throw new Error('Failed to fetch tool history');
        }
        const data = await response.json();
        setHistory(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 flex items-center gap-2">
        <History className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Tool History</h2>
      </div>
      {loading && <p className="p-6 text-gray-500">Loading history...</p>}
      {error && <p className="p-6 text-red-500">{error}</p>}
      <div className="divide-y divide-gray-200">
        {history.map((entry) => (
          
          <HistoryEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );

}

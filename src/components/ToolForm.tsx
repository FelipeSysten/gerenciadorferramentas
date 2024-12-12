import React, { useState } from 'react';
import { Tool } from '../types/tool';
import { Wrench, Save } from 'lucide-react';
import { FormInput } from './ui/FormInput';
import { FormTextArea } from './ui/FormTextArea';

interface ToolFormProps {
  onSubmit?: (tool: Omit<Tool, 'id' | 'status'>) => void;
}

export function ToolForm({ onSubmit }: ToolFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    serialNumber: '',
    category: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status: 'available' }),
      });

      if (!response.ok) {
        throw new Error('Failed to save tool');
      }

      const savedTool = await response.json();
      console.log('Tool saved:', savedTool);

      // Optionally, call parent callback
      if (onSubmit) onSubmit(formData);

      // Reset form
      setFormData({ name: '', description: '', serialNumber: '', category: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Wrench className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Add New Tool</h2>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        <FormInput
          label="Name"
          value={formData.name}
          onChange={handleChange('name')}
          required
        />

        <FormTextArea
          label="Description"
          value={formData.description}
          onChange={handleChange('description')}
          required
          rows={3}
        />

        <FormInput
          label="Serial Number"
          value={formData.serialNumber}
          onChange={handleChange('serialNumber')}
          required
        />

        <FormInput
          label="Category"
          value={formData.category}
          onChange={handleChange('category')}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving...' : 'Save Tool'}
        </button>
      </div>
    </form>
  );
}

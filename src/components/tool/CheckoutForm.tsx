import React, { useState } from 'react';
import { FormInput } from '../ui/FormInput';
import { FormTextArea } from '../ui/FormTextArea';

interface CheckoutFormProps {
  onSubmit: (data: {
    technicianName: string;
    expectedLocation: string;
    expectedReturnDate: string;
    notes?: string;
  }) => void;
  onCancel: () => void;
}

export function CheckoutForm({ onSubmit, onCancel }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    technicianName: '',
    expectedLocation: '',
    expectedReturnDate: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Enviar os dados para o json-server
    fetch('http://localhost:5000/toolHistory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        // Chama o onSubmit do pai após o envio
        onSubmit(data);
      })
      .catch((error) => {
        console.error('Erro ao salvar os dados:', error);
      });
  };

  const handleChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Technician Name"
        value={formData.technicianName}
        onChange={handleChange('technicianName')}
        required
      />

      <FormInput
        label="Expected Location"
        value={formData.expectedLocation}
        onChange={handleChange('expectedLocation')}
        required
      />

      <FormInput
        label="Expected Return Date"
        type="date"
        value={formData.expectedReturnDate}
        onChange={handleChange('expectedReturnDate')}
        required
       // min={today}
      />

      <FormTextArea
        label="Notes"
        value={formData.notes}
        onChange={handleChange('notes')}
        rows={2}
      />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Confirm Checkout
        </button>
      </div>
    </form>
  );
}

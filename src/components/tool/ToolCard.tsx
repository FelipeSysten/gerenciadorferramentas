import React, { useState } from 'react';
import { Tool } from '../../types/tool';
import { ArrowLeftRight, Calendar } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { CheckoutForm } from './CheckoutForm';
import { formatDate } from '../../utils/dateUtils';

interface ToolCardProps {
  tool: Tool;
  onStatusChange: (
    toolId: string,
    checkoutInfo?: {
      technicianName: string;
      expectedLocation: string;
      expectedReturnDate: Date;
      notes?: string;
    }
  ) => void;
}

export function ToolCard({ tool, onStatusChange }: ToolCardProps) {
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const handleCheckout = (data: {
    technicianName: string;
    expectedLocation: string;
    expectedReturnDate: string;
    notes?: string;
  }) => {
    onStatusChange(tool.id, {
      ...data,
      expectedReturnDate: new Date(data.expectedReturnDate),
    });
    setShowCheckoutForm(false);
  };

  const handleStatusChange = () => {
    if (tool.status === 'available') {
      setShowCheckoutForm(true);
    } else {
      onStatusChange(tool.id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{tool.name}</h3>
          <p className="text-gray-600">{tool.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            <p>Serial Number: {tool.serialNumber}</p>
            <p>Category: {tool.category}</p>
            {tool.checkoutInfo && (
              <div className="mt-2 border-t pt-2">
                <p className="font-medium text-gray-700">Checkout Information:</p>
                <p>Technician: {tool.checkoutInfo.technicianName}</p>
                <p>Location: {tool.checkoutInfo.expectedLocation}</p>
                <p>Checkout Date: {formatDate(tool.checkoutInfo.checkoutDate)}</p>
                <p>Expected Return: {formatDate(tool.checkoutInfo.expectedReturnDate)}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={tool.status} itemId={0} />
          <button
            onClick={handleStatusChange}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            title={tool.status === 'available' ? 'Check Out' : 'Check In'}
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showCheckoutForm && (
        <div className="mt-4 border-t pt-4">
          <CheckoutForm
            onSubmit={handleCheckout}
            onCancel={() => setShowCheckoutForm(false)}
          />
        </div>
      )}
    </div>
  );
}
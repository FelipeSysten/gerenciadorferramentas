import React from 'react';

interface FormTextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
}

export function FormTextArea({ 
  label, 
  value, 
  onChange, 
  required = false, 
  rows = 3 
}: FormTextAreaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        rows={rows}
        required={required}
      />
    </div>
  );
}
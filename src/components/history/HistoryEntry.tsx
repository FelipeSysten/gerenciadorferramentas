import React from 'react';
import { ToolHistory } from '../../types/tool';
import { LogIn, LogOut, MapPin, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface HistoryEntryProps {
  entry: ToolHistory;
}

export function HistoryEntry({ entry }: HistoryEntryProps) {
  // Verifique se a data existe e é válida antes de chamar formatDate
  const formattedDate = entry.date ? formatDate(entry.date) : "No Date Provided";
  const formattedExpectedReturnDate = entry.expectedReturnDate
    ? formatDate(entry.expectedReturnDate)
    : "No Return Date";

  return (
    <div className="p-6">
      <div className="flex items-center gap-2">
        {entry.action === 'check-in' ? (
          <LogIn className="w-5 h-5 text-green-600" />
        ) : (
          <LogOut className="w-5 h-5 text-red-600" />
        )}
        <span className="font-medium">
          {entry.action === 'check-in' ? 'Checked In' : 'Checked Out'}
        </span>
      </div>
      <div className="mt-2 text-sm text-gray-600 space-y-1">
        <p className="font-medium">Technician: {entry.technicianName}</p>
        <p>Date: {formattedExpectedReturnDate}</p>
        {entry.expectedLocation && (
          <p className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Location: {entry.expectedLocation}
          </p>
        )}
        {entry.expectedReturnDate && (
          <p className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Expected Return: 
          </p>
        )}
        {entry.notes && (
          <p className="mt-2 text-gray-500">
            Notes: {entry.notes}
          </p>
        )}
      </div>
    </div>
  );
}

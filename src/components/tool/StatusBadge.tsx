import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  itemId: number; // ID do item a ser atualizado
  status: 'available' | 'checked-out'; // Status inicial do item
}

export function StatusBadge({ itemId, status }: StatusBadgeProps) {
  const [currentStatus, setCurrentStatus] = useState<'available' | 'checked-out'>(status); // Estado local do status

  useEffect(() => {
    // Atualizar estado local quando a propriedade mudar
    setCurrentStatus(status);
  }, [status]);

  const handleStatusChange = () => {
    if (!itemId) {
      console.error('Erro: O itemId é inválido ou não fornecido.');
      return;
    }

    const newStatus = currentStatus === 'available' ? 'checked-out' : 'available';

    console.log(`Atualizando item com ID ${itemId} para status ${newStatus}`);

    // Requisição ao json-server
    fetch(`http://localhost:5000/tools/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao atualizar o status. Status HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Resposta da API:', data);
        setCurrentStatus(data.status); // Atualizar estado com o status atualizado
      })
      .catch((error) => {
        console.error('Erro ao atualizar o status:', error);
      });
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm cursor-pointer ${
        currentStatus === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
      onClick={handleStatusChange} // Mudar status ao clicar na badge
    >
      {currentStatus === 'available' ? (
        <CheckCircle className="w-4 h-4 mr-1" />
      ) : (
        <XCircle className="w-4 h-4 mr-1" />
      )}
      {currentStatus}
    </span>
  );
}

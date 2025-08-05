import React from 'react';

interface Bank {
  id: string;
  rssd_id: string;
  name: string;
  city: string;
  state: string;
  charter_type: string;
  regulator: string;
  assets: number;
}

interface BankListProps {
  banks: Bank[];
  selectedBanks: Bank[];
  onBankSelect: (bank: Bank) => void;
  loading: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function BankList({ banks, selectedBanks, onBankSelect, loading }: BankListProps) {
  const isSelected = (bank: Bank) => {
    return selectedBanks.some(b => b.id === bank.id);
  };

  const isMaxReached = selectedBanks.length >= 30;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Results</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Searching...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
        <span className="text-sm text-gray-500">
          {banks.length} banks found
        </span>
      </div>

      {banks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No banks found matching your criteria</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {banks.map((bank) => {
            const selected = isSelected(bank);
            const disabled = !selected && isMaxReached;
            
            return (
              <div
                key={bank.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selected
                    ? 'border-blue-500 bg-blue-50'
                    : disabled
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
                onClick={() => !disabled && onBankSelect(bank)}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selected}
                    disabled={disabled}
                    onChange={() => !disabled && onBankSelect(bank)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {bank.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {bank.city}, {bank.state} • {bank.charter_type} • {bank.regulator}
                        </p>
                        <p className="text-xs text-gray-500">
                          RSSD ID: {bank.rssd_id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(bank.assets)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isMaxReached && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Maximum of 30 banks selected. Remove some banks to add more.
          </p>
        </div>
      )}
    </div>
  );
} 
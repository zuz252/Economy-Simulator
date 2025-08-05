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

interface SelectedBanksProps {
  selectedBanks: Bank[];
  onRemoveBank: (bankId: string) => void;
  onClearSelection: () => void;
  formatCurrency: (amount: number) => string;
}

export default function SelectedBanks({ 
  selectedBanks, 
  onRemoveBank, 
  onClearSelection, 
  formatCurrency 
}: SelectedBanksProps) {
  const totalAssets = selectedBanks.reduce((sum, bank) => sum + bank.assets, 0);
  const averageAssets = selectedBanks.length > 0 ? totalAssets / selectedBanks.length : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Selected Banks</h2>
        <span className="text-sm text-gray-500">
          {selectedBanks.length}/30
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Selection Progress</span>
          <span>{Math.round((selectedBanks.length / 30) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(selectedBanks.length / 30) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Summary Stats */}
      {selectedBanks.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Total Assets</p>
              <p className="font-semibold text-gray-900">{formatCurrency(totalAssets)}</p>
            </div>
            <div>
              <p className="text-gray-600">Average Assets</p>
              <p className="font-semibold text-gray-900">{formatCurrency(averageAssets)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Selected Banks List */}
      {selectedBanks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No banks selected</p>
          <p className="text-xs text-gray-400 mt-1">Select banks from the search results</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {selectedBanks.map((bank) => (
            <div
              key={bank.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {bank.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {bank.city}, {bank.state} • {formatCurrency(bank.assets)}
                </p>
              </div>
              <button
                onClick={() => onRemoveBank(bank.id)}
                className="ml-2 text-red-600 hover:text-red-800 focus:outline-none focus:text-red-800"
                title="Remove bank"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {selectedBanks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={onClearSelection}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Clear All ({selectedBanks.length})
          </button>
        </div>
      )}

      {/* Next Steps */}
      {selectedBanks.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-sm font-medium text-blue-900 mb-1">Next Steps</h3>
          <p className="text-xs text-blue-800">
            Ready to retrieve UBPR data for {selectedBanks.length} selected banks.
          </p>
        </div>
      )}
    </div>
  );
} 
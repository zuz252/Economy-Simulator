'use client';

import React from 'react';
import { Bank } from '../../types/bank';

interface SelectedBanksProps {
  selectedBanks: Bank[];
  totalSelected: number;
  maxAllowed: number;
  isLoading: boolean;
  error: any;
  onRemoveBank: (bankId: string) => void;
  onClearSelection: () => void;
}

const SelectedBanks: React.FC<SelectedBanksProps> = ({
  selectedBanks,
  totalSelected,
  maxAllowed,
  isLoading,
  error,
  onRemoveBank,
  onClearSelection,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-red-600">
          <p>Error loading selection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Selected Banks
          </h2>
          <span className="text-sm text-gray-500">
            {totalSelected} / {maxAllowed}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(totalSelected / maxAllowed) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Clear Selection Button */}
        {totalSelected > 0 && (
          <div className="mt-3">
            <button
              onClick={onClearSelection}
              className="w-full px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        ) : selectedBanks.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <p>No banks selected</p>
            <p className="text-sm mt-1">Search and select banks to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {selectedBanks.map((bank) => (
              <div key={bank.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {bank.bankName}
                    </h3>
                    <div className="mt-1 text-xs text-gray-500">
                      <p>FDIC: {bank.fdicCertificateNumber}</p>
                      <p>{bank.city}, {bank.state}</p>
                      <p className="font-medium text-gray-700">
                        {formatCurrency(bank.totalAssets)}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onRemoveBank(bank.id)}
                    className="flex-shrink-0 ml-2 p-1 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {selectedBanks.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <p>Total Assets: {formatCurrency(selectedBanks.reduce((sum, bank) => sum + bank.totalAssets, 0))}</p>
            <p>Average Assets: {formatCurrency(selectedBanks.reduce((sum, bank) => sum + bank.totalAssets, 0) / selectedBanks.length)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedBanks;

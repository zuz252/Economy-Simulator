'use client';

import React from 'react';
import { Bank } from '../../types/bank';

interface BankListProps {
  banks: Bank[];
  selectedBanks: Bank[];
  isLoading: boolean;
  error: any;
  hasMore: boolean;
  onBankSelect: (bank: Bank) => void;
  onLoadMore: () => void;
}

const BankList: React.FC<BankListProps> = ({
  banks,
  selectedBanks,
  isLoading,
  error,
  hasMore,
  onBankSelect,
  onLoadMore,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isBankSelected = (bankId: string) => {
    return selectedBanks.some(bank => bank.id === bankId);
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-red-600">
          <p>Error loading banks. Please try again.</p>
        </div>
      </div>
    );
  }

  if (isLoading && banks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading banks...</span>
        </div>
      </div>
    );
  }

  if (banks.length === 0 && !isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500 py-8">
          <p>No banks found matching your criteria.</p>
          <p className="text-sm mt-1">Try adjusting your search filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Search Results ({banks.length} banks)
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {banks.map((bank) => {
          const isSelected = isBankSelected(bank.id);
          
          return (
            <div
              key={bank.id}
              className={`px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => onBankSelect(bank)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onBankSelect(bank)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {bank.bankName}
                      </h3>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>FDIC: {bank.fdicCertificateNumber}</span>
                        <span>RSSD: {bank.rssdId}</span>
                        <span>{bank.city}, {bank.state}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 ml-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(bank.totalAssets)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {bank.charterType}
                    </div>
                    <div className="text-xs text-gray-500">
                      {bank.regulator}
                    </div>
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="mt-2 text-xs text-blue-600 font-medium">
                  ✓ Selected
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Load More Banks'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BankList;

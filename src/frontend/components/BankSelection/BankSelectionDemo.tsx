'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Bank, BankSearchCriteria, BankSearchFilters } from '../../types/bank';
import BankSearchForm from './BankSearchForm';
import BankList from './BankList';
import SelectedBanks from './SelectedBanks';

// Mock data for demonstration
const mockBanks: Bank[] = [
  {
    id: '1',
    rssdId: '1234567',
    fdicCertificateNumber: '12345',
    bankName: 'JPMorgan Chase Bank',
    city: 'New York',
    state: 'NY',
    totalAssets: 2500000000000,
    charterType: 'Commercial Bank',
    regulator: 'OCC',
    isActive: true,
    lastFilingDate: new Date('2023-12-31'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-12-31'),
  },
  {
    id: '2',
    rssdId: '2345678',
    fdicCertificateNumber: '23456',
    bankName: 'Bank of America',
    city: 'Charlotte',
    state: 'NC',
    totalAssets: 2000000000000,
    charterType: 'Commercial Bank',
    regulator: 'OCC',
    isActive: true,
    lastFilingDate: new Date('2023-12-31'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-12-31'),
  },
  {
    id: '3',
    rssdId: '3456789',
    fdicCertificateNumber: '34567',
    bankName: 'Wells Fargo Bank',
    city: 'San Francisco',
    state: 'CA',
    totalAssets: 1800000000000,
    charterType: 'Commercial Bank',
    regulator: 'OCC',
    isActive: true,
    lastFilingDate: new Date('2023-12-31'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-12-31'),
  },
  {
    id: '4',
    rssdId: '4567890',
    fdicCertificateNumber: '45678',
    bankName: 'Citibank',
    city: 'New York',
    state: 'NY',
    totalAssets: 1500000000000,
    charterType: 'Commercial Bank',
    regulator: 'OCC',
    isActive: true,
    lastFilingDate: new Date('2023-12-31'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-12-31'),
  },
  {
    id: '5',
    rssdId: '5678901',
    fdicCertificateNumber: '56789',
    bankName: 'U.S. Bank',
    city: 'Minneapolis',
    state: 'MN',
    totalAssets: 1200000000000,
    charterType: 'Commercial Bank',
    regulator: 'OCC',
    isActive: true,
    lastFilingDate: new Date('2023-12-31'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-12-31'),
  },
  {
    id: '6',
    rssdId: '6789012',
    fdicCertificateNumber: '67890',
    bankName: 'PNC Bank',
    city: 'Pittsburgh',
    state: 'PA',
    totalAssets: 800000000000,
    charterType: 'Commercial Bank',
    regulator: 'OCC',
    isActive: true,
    lastFilingDate: new Date('2023-12-31'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-12-31'),
  },
  {
    id: '7',
    rssdId: '7890123',
    fdicCertificateNumber: '78901',
    bankName: 'Capital One Bank',
    city: 'McLean',
    state: 'VA',
    totalAssets: 600000000000,
    charterType: 'Commercial Bank',
    regulator: 'OCC',
    isActive: true,
    lastFilingDate: new Date('2023-12-31'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-12-31'),
  },
  {
    id: '8',
    rssdId: '8901234',
    fdicCertificateNumber: '89012',
    bankName: 'TD Bank',
    city: 'Cherry Hill',
    state: 'NJ',
    totalAssets: 500000000000,
    charterType: 'Commercial Bank',
    regulator: 'OCC',
    isActive: true,
    lastFilingDate: new Date('2023-12-31'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-12-31'),
  },
];

const BankSelectionDemo: React.FC = () => {
  const [searchCriteria, setSearchCriteria] = useState<BankSearchCriteria>({
    limit: 20,
    offset: 0,
  });
  const [filters, setFilters] = useState<BankSearchFilters>({
    search: '',
    state: '',
    charterType: '',
    regulator: '',
    minAssets: '',
    maxAssets: '',
  });
  const [searchResults, setSearchResults] = useState<Bank[]>([]);
  const [selectedBanks, setSelectedBanks] = useState<Bank[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock search function
  const mockSearch = (criteria: BankSearchCriteria) => {
    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      let filteredBanks = [...mockBanks];

      // Apply filters
      if (criteria.search) {
        const searchLower = criteria.search.toLowerCase();
        filteredBanks = filteredBanks.filter(bank =>
          bank.bankName.toLowerCase().includes(searchLower) ||
          bank.fdicCertificateNumber.includes(searchLower) ||
          bank.city.toLowerCase().includes(searchLower) ||
          bank.state.toLowerCase().includes(searchLower)
        );
      }

      if (criteria.state) {
        filteredBanks = filteredBanks.filter(bank => bank.state === criteria.state);
      }

      if (criteria.charterType) {
        filteredBanks = filteredBanks.filter(bank => bank.charterType === criteria.charterType);
      }

      if (criteria.regulator) {
        filteredBanks = filteredBanks.filter(bank => bank.regulator === criteria.regulator);
      }

      if (criteria.minAssets) {
        filteredBanks = filteredBanks.filter(bank => bank.totalAssets >= (criteria.minAssets || 0));
      }

      if (criteria.maxAssets) {
        filteredBanks = filteredBanks.filter(bank => bank.totalAssets <= (criteria.maxAssets || Infinity));
      }

      // Apply pagination
      const start = criteria.offset || 0;
      const end = start + (criteria.limit || 20);
      const paginatedBanks = filteredBanks.slice(start, end);

      setSearchResults(paginatedBanks);
      setIsSearching(false);
      setHasSearched(true);
    }, 500);
  };

  // Handle search form submission
  const handleSearch = (newFilters: BankSearchFilters) => {
    setFilters(newFilters);
    const criteria: BankSearchCriteria = {
      limit: 20,
      offset: 0,
    };

    if (newFilters.search) criteria.search = newFilters.search;
    if (newFilters.state) criteria.state = newFilters.state;
    if (newFilters.charterType) criteria.charterType = newFilters.charterType;
    if (newFilters.regulator) criteria.regulator = newFilters.regulator;
    if (newFilters.minAssets) criteria.minAssets = parseFloat(newFilters.minAssets);
    if (newFilters.maxAssets) criteria.maxAssets = parseFloat(newFilters.maxAssets);

    setSearchCriteria(criteria);
    mockSearch(criteria);
  };

  // Handle bank selection
  const handleBankSelect = (bank: Bank) => {
    const isSelected = selectedBanks.some(b => b.id === bank.id);
    
    if (isSelected) {
      setSelectedBanks(prev => prev.filter(b => b.id !== bank.id));
      toast.success('Bank removed from selection');
    } else {
      if (selectedBanks.length >= 30) {
        toast.error('Cannot select more than 30 banks');
        return;
      }
      setSelectedBanks(prev => [...prev, bank]);
      toast.success('Bank added to selection');
    }
  };

  // Handle load more banks
  const handleLoadMore = () => {
    const newCriteria = {
      ...searchCriteria,
      offset: (searchCriteria.offset || 0) + (searchCriteria.limit || 20),
    };
    setSearchCriteria(newCriteria);
    mockSearch(newCriteria);
  };

  // Handle clear selection
  const handleClearSelection = () => {
    if (window.confirm('Are you sure you want to clear all selected banks?')) {
      setSelectedBanks([]);
      toast.success('Bank selection cleared');
    }
  };

  // Handle remove bank from selection
  const handleRemoveBank = (bankId: string) => {
    setSelectedBanks(prev => prev.filter(b => b.id !== bankId));
    toast.success('Bank removed from selection');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bank Selection Demo</h1>
          <p className="mt-2 text-gray-600">
            Search and select up to 30 banks for UBPR data analysis and simulation
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Demo Mode:</strong> This is a demonstration with mock data. The search and selection functionality is fully interactive.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Search and Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Form */}
            <BankSearchForm
              filters={filters}
              onSearch={handleSearch}
              isLoading={isSearching}
            />

            {/* Bank List */}
            <BankList
              banks={searchResults}
              selectedBanks={selectedBanks}
              isLoading={isSearching}
              error={null}
              hasMore={false} // Simplified for demo
              onBankSelect={handleBankSelect}
              onLoadMore={handleLoadMore}
            />

            {!hasSearched && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center text-gray-500 py-8">
                  <p>Use the search form above to find banks</p>
                  <p className="text-sm mt-1">Try searching by bank name, state, or other criteria</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Selected Banks */}
          <div className="lg:col-span-1">
            <SelectedBanks
              selectedBanks={selectedBanks}
              totalSelected={selectedBanks.length}
              maxAllowed={30}
              isLoading={false}
              error={null}
              onRemoveBank={handleRemoveBank}
              onClearSelection={handleClearSelection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankSelectionDemo;

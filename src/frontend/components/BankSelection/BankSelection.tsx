'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { bankService } from '../../services/bankService';
import { Bank, BankSearchCriteria, BankSearchFilters } from '../../types/bank';
import BankSearchForm from './BankSearchForm';
import BankList from './BankList';
import SelectedBanks from './SelectedBanks';
import { toast } from 'react-hot-toast';

const BankSelection: React.FC = () => {
  const queryClient = useQueryClient();
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

  // Query for bank search results
  const {
    data: searchResult,
    isLoading: isSearching,
    error: searchError,
    refetch: refetchSearch,
  } = useQuery(
    ['banks', searchCriteria],
    () => bankService.searchBanks(searchCriteria),
    {
      enabled: false, // Don't run automatically
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Query for current bank selection
  const {
    data: selectionData,
    isLoading: isSelectionLoading,
    error: selectionError,
  } = useQuery(
    ['bankSelection'],
    bankService.getBankSelection,
    {
      staleTime: 30 * 1000, // 30 seconds
    }
  );

  // Mutation for adding bank to selection
  const addBankMutation = useMutation(
    bankService.addBankToSelection,
    {
      onSuccess: (data) => {
        if (data.success) {
          toast.success(data.message || 'Bank added to selection');
          queryClient.invalidateQueries(['bankSelection']);
        } else {
          toast.error(data.message || 'Failed to add bank');
        }
      },
      onError: (error) => {
        toast.error('Failed to add bank to selection');
        console.error('Add bank error:', error);
      },
    }
  );

  // Mutation for removing bank from selection
  const removeBankMutation = useMutation(
    bankService.removeBankFromSelection,
    {
      onSuccess: (data) => {
        if (data.success) {
          toast.success(data.message || 'Bank removed from selection');
          queryClient.invalidateQueries(['bankSelection']);
        } else {
          toast.error(data.message || 'Failed to remove bank');
        }
      },
      onError: (error) => {
        toast.error('Failed to remove bank from selection');
        console.error('Remove bank error:', error);
      },
    }
  );

  // Mutation for clearing bank selection
  const clearSelectionMutation = useMutation(
    bankService.clearBankSelection,
    {
      onSuccess: (data) => {
        if (data.success) {
          toast.success('Bank selection cleared');
          queryClient.invalidateQueries(['bankSelection']);
        } else {
          toast.error(data.message || 'Failed to clear selection');
        }
      },
      onError: (error) => {
        toast.error('Failed to clear bank selection');
        console.error('Clear selection error:', error);
      },
    }
  );

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
    refetchSearch();
  };

  // Handle bank selection
  const handleBankSelect = (bank: Bank) => {
    const isSelected = selectionData?.selectedBanks.some(b => b.id === bank.id);
    
    if (isSelected) {
      removeBankMutation.mutate(bank.id);
    } else {
      if (selectionData && selectionData.totalSelected >= selectionData.maxAllowed) {
        toast.error(`Cannot select more than ${selectionData.maxAllowed} banks`);
        return;
      }
      addBankMutation.mutate(bank.id);
    }
  };

  // Handle load more banks
  const handleLoadMore = () => {
    if (searchResult?.hasMore) {
      setSearchCriteria(prev => ({
        ...prev,
        offset: (prev.offset || 0) + (prev.limit || 20),
      }));
    }
  };

  // Handle clear selection
  const handleClearSelection = () => {
    if (window.confirm('Are you sure you want to clear all selected banks?')) {
      clearSelectionMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bank Selection</h1>
          <p className="mt-2 text-gray-600">
            Search and select up to 30 banks for UBPR data analysis and simulation
          </p>
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
              banks={searchResult?.banks || []}
              selectedBanks={selectionData?.selectedBanks || []}
              isLoading={isSearching}
              error={searchError}
              hasMore={searchResult?.hasMore || false}
              onBankSelect={handleBankSelect}
              onLoadMore={handleLoadMore}
            />
          </div>

          {/* Right Column - Selected Banks */}
          <div className="lg:col-span-1">
            <SelectedBanks
              selectedBanks={selectionData?.selectedBanks || []}
              totalSelected={selectionData?.totalSelected || 0}
              maxAllowed={selectionData?.maxAllowed || 30}
              isLoading={isSelectionLoading}
              error={selectionError}
              onRemoveBank={(bankId) => removeBankMutation.mutate(bankId)}
              onClearSelection={handleClearSelection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankSelection;

import React, { useState } from 'react';
import BankSearchForm from './BankSearchForm';
import BankList from './BankList';
import SelectedBanks from './SelectedBanks';

// Mock data for demo
const mockBanks = [
  {
    id: '1',
    rssd_id: '1234567',
    name: 'JPMorgan Chase Bank',
    city: 'New York',
    state: 'NY',
    charter_type: 'National',
    regulator: 'OCC',
    assets: 2500000000000
  },
  {
    id: '2',
    rssd_id: '2345678',
    name: 'Bank of America',
    city: 'Charlotte',
    state: 'NC',
    charter_type: 'National',
    regulator: 'OCC',
    assets: 2000000000000
  },
  {
    id: '3',
    rssd_id: '3456789',
    name: 'Wells Fargo Bank',
    city: 'San Francisco',
    state: 'CA',
    charter_type: 'National',
    regulator: 'OCC',
    assets: 1800000000000
  },
  {
    id: '4',
    rssd_id: '4567890',
    name: 'Citibank',
    city: 'New York',
    state: 'NY',
    charter_type: 'National',
    regulator: 'OCC',
    assets: 1500000000000
  },
  {
    id: '5',
    rssd_id: '5678901',
    name: 'U.S. Bank',
    city: 'Minneapolis',
    state: 'MN',
    charter_type: 'National',
    regulator: 'OCC',
    assets: 500000000000
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function BankSelectionDemo() {
  const [searchResults, setSearchResults] = useState(mockBanks);
  const [selectedBanks, setSelectedBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (criteria: any) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const filtered = mockBanks.filter(bank => {
        if (criteria.search && !bank.name.toLowerCase().includes(criteria.search.toLowerCase())) {
          return false;
        }
        if (criteria.state && bank.state !== criteria.state) {
          return false;
        }
        if (criteria.charter_type && bank.charter_type !== criteria.charter_type) {
          return false;
        }
        if (criteria.regulator && bank.regulator !== criteria.regulator) {
          return false;
        }
        if (criteria.min_assets && bank.assets < parseFloat(criteria.min_assets)) {
          return false;
        }
        if (criteria.max_assets && bank.assets > parseFloat(criteria.max_assets)) {
          return false;
        }
        return true;
      });
      setSearchResults(filtered);
      setLoading(false);
    }, 500);
  };

  const handleBankSelect = (bank: any) => {
    if (selectedBanks.find(b => b.id === bank.id)) {
      setSelectedBanks(selectedBanks.filter(b => b.id !== bank.id));
    } else if (selectedBanks.length < 30) {
      setSelectedBanks([...selectedBanks, bank]);
    }
  };

  const handleRemoveBank = (bankId: string) => {
    setSelectedBanks(selectedBanks.filter(b => b.id !== bankId));
  };

  const handleClearSelection = () => {
    setSelectedBanks([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Economy Simulator - Bank Selection
        </h1>
        <p className="text-gray-600">
          Select up to 30 banks for UBPR data analysis and simulation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search Form */}
        <div className="lg:col-span-1">
          <BankSearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {/* Bank List */}
        <div className="lg:col-span-1">
          <BankList
            banks={searchResults}
            selectedBanks={selectedBanks}
            onBankSelect={handleBankSelect}
            loading={loading}
          />
        </div>

        {/* Selected Banks */}
        <div className="lg:col-span-1">
          <SelectedBanks
            selectedBanks={selectedBanks}
            onRemoveBank={handleRemoveBank}
            onClearSelection={handleClearSelection}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>
    </div>
  );
} 
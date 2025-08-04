'use client';

import React, { useState } from 'react';
import { BankSearchFilters } from '../../types/bank';

interface BankSearchFormProps {
  filters: BankSearchFilters;
  onSearch: (filters: BankSearchFilters) => void;
  isLoading: boolean;
}

const BankSearchForm: React.FC<BankSearchFormProps> = ({
  filters,
  onSearch,
  isLoading,
}) => {
  const [formData, setFormData] = useState<BankSearchFilters>(filters);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(formData);
  };

  const handleReset = () => {
    const resetFilters: BankSearchFilters = {
      search: '',
      state: '',
      charterType: '',
      regulator: '',
      minAssets: '',
      maxAssets: '',
    };
    setFormData(resetFilters);
    onSearch(resetFilters);
  };

  const handleInputChange = (field: keyof BankSearchFilters, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Banks</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search Term */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={formData.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              placeholder="Bank name, FDIC cert #, city..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <select
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All States</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
          </div>

          {/* Charter Type */}
          <div>
            <label htmlFor="charterType" className="block text-sm font-medium text-gray-700 mb-1">
              Charter Type
            </label>
            <select
              id="charterType"
              value={formData.charterType}
              onChange={(e) => handleInputChange('charterType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="Commercial Bank">Commercial Bank</option>
              <option value="Savings Bank">Savings Bank</option>
              <option value="Credit Union">Credit Union</option>
              <option value="Thrift">Thrift</option>
            </select>
          </div>

          {/* Regulator */}
          <div>
            <label htmlFor="regulator" className="block text-sm font-medium text-gray-700 mb-1">
              Regulator
            </label>
            <select
              id="regulator"
              value={formData.regulator}
              onChange={(e) => handleInputChange('regulator', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Regulators</option>
              <option value="FDIC">FDIC</option>
              <option value="OCC">OCC</option>
              <option value="FRB">Federal Reserve</option>
              <option value="NCUA">NCUA</option>
            </select>
          </div>

          {/* Min Assets */}
          <div>
            <label htmlFor="minAssets" className="block text-sm font-medium text-gray-700 mb-1">
              Min Assets ($)
            </label>
            <input
              type="number"
              id="minAssets"
              value={formData.minAssets}
              onChange={(e) => handleInputChange('minAssets', e.target.value)}
              placeholder="0"
              min="0"
              step="1000000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Max Assets */}
          <div>
            <label htmlFor="maxAssets" className="block text-sm font-medium text-gray-700 mb-1">
              Max Assets ($)
            </label>
            <input
              type="number"
              id="maxAssets"
              value={formData.maxAssets}
              onChange={(e) => handleInputChange('maxAssets', e.target.value)}
              placeholder="No limit"
              min="0"
              step="1000000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BankSearchForm;

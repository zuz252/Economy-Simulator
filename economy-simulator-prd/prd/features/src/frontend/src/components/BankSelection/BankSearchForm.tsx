import React, { useState } from 'react';

interface BankSearchFormProps {
  onSearch: (criteria: any) => void;
  loading: boolean;
}

export default function BankSearchForm({ onSearch, loading }: BankSearchFormProps) {
  const [formData, setFormData] = useState({
    search: '',
    state: '',
    charter_type: '',
    regulator: '',
    min_assets: '',
    max_assets: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(formData);
  };

  const handleReset = () => {
    setFormData({
      search: '',
      state: '',
      charter_type: '',
      regulator: '',
      min_assets: '',
      max_assets: ''
    });
    onSearch({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Banks</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Bank Name
          </label>
          <input
            type="text"
            id="search"
            name="search"
            value={formData.search}
            onChange={handleChange}
            placeholder="Search by bank name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All States</option>
            <option value="NY">New York</option>
            <option value="CA">California</option>
            <option value="NC">North Carolina</option>
            <option value="MN">Minnesota</option>
            <option value="TX">Texas</option>
            <option value="FL">Florida</option>
          </select>
        </div>

        <div>
          <label htmlFor="charter_type" className="block text-sm font-medium text-gray-700 mb-1">
            Charter Type
          </label>
          <select
            id="charter_type"
            name="charter_type"
            value={formData.charter_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="National">National</option>
            <option value="State">State</option>
            <option value="Federal">Federal</option>
          </select>
        </div>

        <div>
          <label htmlFor="regulator" className="block text-sm font-medium text-gray-700 mb-1">
            Regulator
          </label>
          <select
            id="regulator"
            name="regulator"
            value={formData.regulator}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Regulators</option>
            <option value="OCC">OCC</option>
            <option value="FDIC">FDIC</option>
            <option value="FRB">FRB</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="min_assets" className="block text-sm font-medium text-gray-700 mb-1">
              Min Assets ($)
            </label>
            <input
              type="number"
              id="min_assets"
              name="min_assets"
              value={formData.min_assets}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="max_assets" className="block text-sm font-medium text-gray-700 mb-1">
              Max Assets ($)
            </label>
            <input
              type="number"
              id="max_assets"
              name="max_assets"
              value={formData.max_assets}
              onChange={handleChange}
              placeholder="∞"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
} 
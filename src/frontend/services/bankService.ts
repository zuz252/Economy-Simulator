import axios from 'axios';
import { 
  Bank, 
  BankSearchCriteria, 
  BankSearchResult, 
  BankSelectionRequest, 
  BankSelectionResponse 
} from '../types/bank';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  // TODO: Add authentication token when implemented
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bankService = {
  /**
   * Search for banks based on criteria
   */
  async searchBanks(criteria: BankSearchCriteria): Promise<BankSearchResult> {
    try {
      const params = new URLSearchParams();
      
      if (criteria.search) params.append('search', criteria.search);
      if (criteria.state) params.append('state', criteria.state);
      if (criteria.charterType) params.append('charterType', criteria.charterType);
      if (criteria.regulator) params.append('regulator', criteria.regulator);
      if (criteria.minAssets) params.append('minAssets', criteria.minAssets.toString());
      if (criteria.maxAssets) params.append('maxAssets', criteria.maxAssets.toString());
      if (criteria.limit) params.append('limit', criteria.limit.toString());
      if (criteria.offset) params.append('offset', criteria.offset.toString());

      const response = await api.get(`/banks/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching banks:', error);
      throw new Error('Failed to search banks');
    }
  },

  /**
   * Get bank by ID
   */
  async getBankById(id: string): Promise<Bank> {
    try {
      const response = await api.get(`/banks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting bank:', error);
      throw new Error('Failed to get bank');
    }
  },

  /**
   * Get current bank selection for user
   */
  async getBankSelection(): Promise<{
    selectedBanks: Bank[];
    count: number;
  }> {
    try {
      const response = await api.get('/banks/selection');
      return response.data;
    } catch (error) {
      console.error('Error getting bank selection:', error);
      throw new Error('Failed to get bank selection');
    }
  },

  /**
   * Update bank selection for user
   */
  async updateBankSelection(request: BankSelectionRequest): Promise<BankSelectionResponse> {
    try {
      const response = await api.post('/banks/selection', request);
      return response.data;
    } catch (error) {
      console.error('Error updating bank selection:', error);
      throw new Error('Failed to update bank selection');
    }
  },

  /**
   * Add bank to selection
   */
  async addBankToSelection(bankId: string): Promise<BankSelectionResponse> {
    try {
      const response = await api.post('/banks/selection/add', { bankId });
      return response.data;
    } catch (error) {
      console.error('Error adding bank to selection:', error);
      throw new Error('Failed to add bank to selection');
    }
  },

  /**
   * Remove bank from selection
   */
  async removeBankFromSelection(bankId: string): Promise<BankSelectionResponse> {
    try {
      const response = await api.delete('/banks/selection/remove', { 
        data: { bankId } 
      });
      return response.data;
    } catch (error) {
      console.error('Error removing bank from selection:', error);
      throw new Error('Failed to remove bank from selection');
    }
  },

  /**
   * Clear bank selection
   */
  async clearBankSelection(): Promise<BankSelectionResponse> {
    try {
      const response = await api.delete('/banks/selection/clear');
      return response.data;
    } catch (error) {
      console.error('Error clearing bank selection:', error);
      throw new Error('Failed to clear bank selection');
    }
  },
};

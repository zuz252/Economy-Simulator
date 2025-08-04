export interface Bank {
  id: string;
  rssdId: string;
  fdicCertificateNumber: string;
  bankName: string;
  city: string;
  state: string;
  totalAssets: number;
  charterType: string;
  regulator: string;
  isActive: boolean;
  lastFilingDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BankSearchCriteria {
  search?: string;
  state?: string;
  charterType?: string;
  regulator?: string;
  minAssets?: number;
  maxAssets?: number;
  limit?: number;
  offset?: number;
}

export interface BankSearchResult {
  banks: Bank[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface BankSelection {
  id: string;
  userId: string;
  selectedBanks: string[];
  maxBanks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BankSelectionRequest {
  bankIds: string[];
  maxBanks?: number;
}

export interface BankSelectionResponse {
  success: boolean;
  selectedBanks: Bank[];
  totalSelected: number;
  maxAllowed: number;
  message?: string;
}

export interface BankSearchFilters {
  search: string;
  state: string;
  charterType: string;
  regulator: string;
  minAssets: string;
  maxAssets: string;
}

export interface BankSelectionState {
  selectedBanks: Bank[];
  totalSelected: number;
  maxAllowed: number;
  isLoading: boolean;
  error: string | null;
}

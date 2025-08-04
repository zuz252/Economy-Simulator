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
  selectedBanks: string[]; // Array of bank IDs
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

// Database schema for banks table
export const BANK_TABLE_SCHEMA = `
  CREATE TABLE IF NOT EXISTS banks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rssd_id VARCHAR(20) UNIQUE NOT NULL,
    fdic_certificate_number VARCHAR(20) UNIQUE NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    total_assets DECIMAL(20,2) NOT NULL,
    charter_type VARCHAR(50) NOT NULL,
    regulator VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_filing_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_banks_rssd_id ON banks(rssd_id);
  CREATE INDEX IF NOT EXISTS idx_banks_fdic_cert ON banks(fdic_certificate_number);
  CREATE INDEX IF NOT EXISTS idx_banks_name ON banks(bank_name);
  CREATE INDEX IF NOT EXISTS idx_banks_state ON banks(state);
  CREATE INDEX IF NOT EXISTS idx_banks_assets ON banks(total_assets);
  CREATE INDEX IF NOT EXISTS idx_banks_active ON banks(is_active);
`;

// Database schema for bank selections table
export const BANK_SELECTION_TABLE_SCHEMA = `
  CREATE TABLE IF NOT EXISTS bank_selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    selected_banks UUID[] NOT NULL DEFAULT '{}',
    max_banks INTEGER DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_bank_selections_user_id ON bank_selections(user_id);
  CREATE INDEX IF NOT EXISTS idx_bank_selections_created_at ON bank_selections(created_at);
`;

// Validation schemas
export const BANK_SEARCH_VALIDATION = {
  search: 'string|optional|max:100',
  state: 'string|optional|max:2',
  charterType: 'string|optional|max:50',
  regulator: 'string|optional|max:50',
  minAssets: 'number|optional|min:0',
  maxAssets: 'number|optional|min:0',
  limit: 'number|optional|min:1|max:100',
  offset: 'number|optional|min:0'
};

export const BANK_SELECTION_VALIDATION = {
  bankIds: 'array|required|min:1|max:30',
  'bankIds.*': 'string|required|uuid',
  maxBanks: 'number|optional|min:1|max:30'
}; 
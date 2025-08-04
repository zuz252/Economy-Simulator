import { Pool, PoolClient } from 'pg';
import { Bank, BankSearchCriteria, BankSearchResult, BankSelection, BankSelectionRequest, BankSelectionResponse } from '@/models/bank/Bank';
import { logger } from '@/utils/logger';
import { ValidationError } from '@/utils/errors';

export class BankService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Search for banks based on criteria
   */
  async searchBanks(criteria: BankSearchCriteria): Promise<BankSearchResult> {
    try {
      const { search, state, charterType, regulator, minAssets, maxAssets, limit = 20, offset = 0 } = criteria;

      let query = `
        SELECT 
          id, rssd_id, fdic_certificate_number, bank_name, city, state,
          total_assets, charter_type, regulator, is_active, last_filing_date,
          created_at, updated_at
        FROM banks 
        WHERE is_active = true
      `;
      
      const params: any[] = [];
      let paramIndex = 1;

      // Add search conditions
      if (search) {
        query += ` AND (
          bank_name ILIKE $${paramIndex} OR 
          fdic_certificate_number ILIKE $${paramIndex} OR 
          city ILIKE $${paramIndex} OR 
          state ILIKE $${paramIndex}
        )`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      if (state) {
        query += ` AND state = $${paramIndex}`;
        params.push(state.toUpperCase());
        paramIndex++;
      }

      if (charterType) {
        query += ` AND charter_type = $${paramIndex}`;
        params.push(charterType);
        paramIndex++;
      }

      if (regulator) {
        query += ` AND regulator = $${paramIndex}`;
        params.push(regulator);
        paramIndex++;
      }

      if (minAssets) {
        query += ` AND total_assets >= $${paramIndex}`;
        params.push(minAssets);
        paramIndex++;
      }

      if (maxAssets) {
        query += ` AND total_assets <= $${paramIndex}`;
        params.push(maxAssets);
        paramIndex++;
      }

      // Get total count
      const countQuery = query.replace(/SELECT.*FROM/, 'SELECT COUNT(*) FROM');
      const countResult = await this.pool.query(countQuery, params);
      const total = parseInt(countResult.rows[0].count);

      // Add ordering and pagination
      query += ` ORDER BY total_assets DESC, bank_name ASC`;
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limit, offset);

      const result = await this.pool.query(query, params);
      
      const banks: Bank[] = result.rows.map(row => ({
        id: row.id,
        rssdId: row.rssd_id,
        fdicCertificateNumber: row.fdic_certificate_number,
        bankName: row.bank_name,
        city: row.city,
        state: row.state,
        totalAssets: parseFloat(row.total_assets),
        charterType: row.charter_type,
        regulator: row.regulator,
        isActive: row.is_active,
        lastFilingDate: row.last_filing_date ? new Date(row.last_filing_date) : null,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      }));

      return {
        banks,
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      };
    } catch (error) {
      logger.error('Error searching banks:', error);
      throw new Error('Failed to search banks');
    }
  }

  /**
   * Get bank by ID
   */
  async getBankById(id: string): Promise<Bank | null> {
    try {
      const query = `
        SELECT 
          id, rssd_id, fdic_certificate_number, bank_name, city, state,
          total_assets, charter_type, regulator, is_active, last_filing_date,
          created_at, updated_at
        FROM banks 
        WHERE id = $1 AND is_active = true
      `;
      
      const result = await this.pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        rssdId: row.rssd_id,
        fdicCertificateNumber: row.fdic_certificate_number,
        bankName: row.bank_name,
        city: row.city,
        state: row.state,
        totalAssets: parseFloat(row.total_assets),
        charterType: row.charter_type,
        regulator: row.regulator,
        isActive: row.is_active,
        lastFilingDate: row.last_filing_date ? new Date(row.last_filing_date) : null,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };
    } catch (error) {
      logger.error('Error getting bank by ID:', error);
      throw new Error('Failed to get bank');
    }
  }

  /**
   * Get banks by IDs
   */
  async getBanksByIds(ids: string[]): Promise<Bank[]> {
    try {
      if (ids.length === 0) {
        return [];
      }

      const placeholders = ids.map((_, index) => `$${index + 1}`).join(',');
      const query = `
        SELECT 
          id, rssd_id, fdic_certificate_number, bank_name, city, state,
          total_assets, charter_type, regulator, is_active, last_filing_date,
          created_at, updated_at
        FROM banks 
        WHERE id IN (${placeholders}) AND is_active = true
        ORDER BY total_assets DESC, bank_name ASC
      `;
      
      const result = await this.pool.query(query, ids);
      
      return result.rows.map(row => ({
        id: row.id,
        rssdId: row.rssd_id,
        fdicCertificateNumber: row.fdic_certificate_number,
        bankName: row.bank_name,
        city: row.city,
        state: row.state,
        totalAssets: parseFloat(row.total_assets),
        charterType: row.charter_type,
        regulator: row.regulator,
        isActive: row.is_active,
        lastFilingDate: row.last_filing_date ? new Date(row.last_filing_date) : null,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      }));
    } catch (error) {
      logger.error('Error getting banks by IDs:', error);
      throw new Error('Failed to get banks');
    }
  }

  /**
   * Get or create bank selection for user
   */
  async getBankSelection(userId: string): Promise<BankSelection> {
    try {
      const query = `
        SELECT id, user_id, selected_banks, max_banks, created_at, updated_at
        FROM bank_selections 
        WHERE user_id = $1
      `;
      
      const result = await this.pool.query(query, [userId]);
      
      if (result.rows.length === 0) {
        // Create new selection
        const insertQuery = `
          INSERT INTO bank_selections (user_id, selected_banks, max_banks)
          VALUES ($1, $2, $3)
          RETURNING id, user_id, selected_banks, max_banks, created_at, updated_at
        `;
        
        const insertResult = await this.pool.query(insertQuery, [userId, [], 30]);
        const row = insertResult.rows[0];
        
        return {
          id: row.id,
          userId: row.user_id,
          selectedBanks: row.selected_banks || [],
          maxBanks: row.max_banks,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at)
        };
      }

      const row = result.rows[0];
      return {
        id: row.id,
        userId: row.user_id,
        selectedBanks: row.selected_banks || [],
        maxBanks: row.max_banks,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };
    } catch (error) {
      logger.error('Error getting bank selection:', error);
      throw new Error('Failed to get bank selection');
    }
  }

  /**
   * Update bank selection for user
   */
  async updateBankSelection(userId: string, request: BankSelectionRequest): Promise<BankSelectionResponse> {
    try {
      const { bankIds, maxBanks = 30 } = request;

      // Validate bank count
      if (bankIds.length > maxBanks) {
        throw new ValidationError(`Cannot select more than ${maxBanks} banks`);
      }

      // Verify all banks exist
      const banks = await this.getBanksByIds(bankIds);
      if (banks.length !== bankIds.length) {
        throw new ValidationError('One or more banks not found');
      }

      // Update or create selection
      const upsertQuery = `
        INSERT INTO bank_selections (user_id, selected_banks, max_banks)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          selected_banks = EXCLUDED.selected_banks,
          max_banks = EXCLUDED.max_banks,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id, user_id, selected_banks, max_banks, created_at, updated_at
      `;
      
      const result = await this.pool.query(upsertQuery, [userId, bankIds, maxBanks]);
      const row = result.rows[0];

      const selection: BankSelection = {
        id: row.id,
        userId: row.user_id,
        selectedBanks: row.selected_banks || [],
        maxBanks: row.max_banks,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };

      return {
        success: true,
        selectedBanks: banks,
        totalSelected: banks.length,
        maxAllowed: maxBanks,
        message: `Successfully selected ${banks.length} banks`
      };
    } catch (error) {
      logger.error('Error updating bank selection:', error);
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error('Failed to update bank selection');
    }
  }

  /**
   * Add bank to selection
   */
  async addBankToSelection(userId: string, bankId: string): Promise<BankSelectionResponse> {
    try {
      const selection = await this.getBankSelection(userId);
      
      if (selection.selectedBanks.includes(bankId)) {
        return {
          success: false,
          selectedBanks: [],
          totalSelected: selection.selectedBanks.length,
          maxAllowed: selection.maxBanks,
          message: 'Bank already selected'
        };
      }

      if (selection.selectedBanks.length >= selection.maxBanks) {
        throw new ValidationError(`Cannot select more than ${selection.maxBanks} banks`);
      }

      const newBankIds = [...selection.selectedBanks, bankId];
      return await this.updateBankSelection(userId, { bankIds: newBankIds, maxBanks: selection.maxBanks });
    } catch (error) {
      logger.error('Error adding bank to selection:', error);
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error('Failed to add bank to selection');
    }
  }

  /**
   * Remove bank from selection
   */
  async removeBankFromSelection(userId: string, bankId: string): Promise<BankSelectionResponse> {
    try {
      const selection = await this.getBankSelection(userId);
      
      if (!selection.selectedBanks.includes(bankId)) {
        return {
          success: false,
          selectedBanks: [],
          totalSelected: selection.selectedBanks.length,
          maxAllowed: selection.maxBanks,
          message: 'Bank not in selection'
        };
      }

      const newBankIds = selection.selectedBanks.filter(id => id !== bankId);
      return await this.updateBankSelection(userId, { bankIds: newBankIds, maxBanks: selection.maxBanks });
    } catch (error) {
      logger.error('Error removing bank from selection:', error);
      throw new Error('Failed to remove bank from selection');
    }
  }

  /**
   * Clear bank selection
   */
  async clearBankSelection(userId: string): Promise<BankSelectionResponse> {
    try {
      return await this.updateBankSelection(userId, { bankIds: [] });
    } catch (error) {
      logger.error('Error clearing bank selection:', error);
      throw new Error('Failed to clear bank selection');
    }
  }
} 
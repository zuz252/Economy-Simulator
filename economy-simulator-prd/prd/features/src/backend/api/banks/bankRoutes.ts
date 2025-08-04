import { Router, Request, Response } from 'express';
import { BankService } from '@/services/bank-service/BankService';
import { BankSearchCriteria, BankSelectionRequest } from '@/models/bank/Bank';
import { ValidationError } from '@/utils/errors';
import { logger } from '@/utils/logger';

export function createBankRoutes(bankService: BankService): Router {
  const router = Router();

  /**
   * GET /api/banks/search
   * Search for banks based on criteria
   */
  router.get('/search', async (req: Request, res: Response) => {
    try {
      const {
        search,
        state,
        charterType,
        regulator,
        minAssets,
        maxAssets,
        limit = '20',
        offset = '0'
      } = req.query;

      const criteria: BankSearchCriteria = {
        search: search as string,
        state: state as string,
        charterType: charterType as string,
        regulator: regulator as string,
        minAssets: minAssets ? parseFloat(minAssets as string) : undefined,
        maxAssets: maxAssets ? parseFloat(maxAssets as string) : undefined,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      };

      // Validate criteria
      if (criteria.limit < 1 || criteria.limit > 100) {
        throw new ValidationError('Limit must be between 1 and 100');
      }

      if (criteria.offset < 0) {
        throw new ValidationError('Offset must be non-negative');
      }

      const result = await bankService.searchBanks(criteria);

      res.json({
        success: true,
        data: result,
        message: `Found ${result.total} banks`
      });
    } catch (error) {
      logger.error('Error in bank search:', error);
      
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  });

  /**
   * GET /api/banks/:id
   * Get bank by ID
   */
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError('Bank ID is required');
      }

      const bank = await bankService.getBankById(id);

      if (!bank) {
        res.status(404).json({
          success: false,
          error: 'Bank not found'
        });
        return;
      }

      res.json({
        success: true,
        data: bank
      });
    } catch (error) {
      logger.error('Error getting bank by ID:', error);
      
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  });

  /**
   * GET /api/banks/selection
   * Get current bank selection for user
   */
  router.get('/selection', async (req: Request, res: Response) => {
    try {
      // TODO: Get user ID from authentication middleware
      const userId = req.headers['user-id'] as string || 'default-user';

      const selection = await bankService.getBankSelection(userId);
      const selectedBanks = await bankService.getBanksByIds(selection.selectedBanks);

      res.json({
        success: true,
        data: {
          selection,
          selectedBanks,
          totalSelected: selectedBanks.length,
          maxAllowed: selection.maxBanks
        }
      });
    } catch (error) {
      logger.error('Error getting bank selection:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  /**
   * POST /api/banks/selection
   * Update bank selection for user
   */
  router.post('/selection', async (req: Request, res: Response) => {
    try {
      // TODO: Get user ID from authentication middleware
      const userId = req.headers['user-id'] as string || 'default-user';
      const request: BankSelectionRequest = req.body;

      if (!request.bankIds || !Array.isArray(request.bankIds)) {
        throw new ValidationError('bankIds array is required');
      }

      if (request.bankIds.length > 30) {
        throw new ValidationError('Cannot select more than 30 banks');
      }

      const result = await bankService.updateBankSelection(userId, request);

      res.json({
        success: result.success,
        data: result,
        message: result.message
      });
    } catch (error) {
      logger.error('Error updating bank selection:', error);
      
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  });

  /**
   * POST /api/banks/selection/add
   * Add bank to selection
   */
  router.post('/selection/add', async (req: Request, res: Response) => {
    try {
      // TODO: Get user ID from authentication middleware
      const userId = req.headers['user-id'] as string || 'default-user';
      const { bankId } = req.body;

      if (!bankId) {
        throw new ValidationError('bankId is required');
      }

      const result = await bankService.addBankToSelection(userId, bankId);

      res.json({
        success: result.success,
        data: result,
        message: result.message
      });
    } catch (error) {
      logger.error('Error adding bank to selection:', error);
      
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  });

  /**
   * DELETE /api/banks/selection/remove
   * Remove bank from selection
   */
  router.delete('/selection/remove', async (req: Request, res: Response) => {
    try {
      // TODO: Get user ID from authentication middleware
      const userId = req.headers['user-id'] as string || 'default-user';
      const { bankId } = req.body;

      if (!bankId) {
        throw new ValidationError('bankId is required');
      }

      const result = await bankService.removeBankFromSelection(userId, bankId);

      res.json({
        success: result.success,
        data: result,
        message: result.message
      });
    } catch (error) {
      logger.error('Error removing bank from selection:', error);
      
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  });

  /**
   * DELETE /api/banks/selection/clear
   * Clear bank selection
   */
  router.delete('/selection/clear', async (req: Request, res: Response) => {
    try {
      // TODO: Get user ID from authentication middleware
      const userId = req.headers['user-id'] as string || 'default-user';

      const result = await bankService.clearBankSelection(userId);

      res.json({
        success: result.success,
        data: result,
        message: result.message
      });
    } catch (error) {
      logger.error('Error clearing bank selection:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  return router;
} 
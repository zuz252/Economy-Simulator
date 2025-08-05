import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3001;

// Initialize Supabase client (optional for demo)
let supabase: any = null;
if (process.env['SUPABASE_URL'] && process.env['SUPABASE_SERVICE_ROLE_KEY']) {
  try {
    const supabaseUrl = process.env['SUPABASE_URL'];
    const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✅ Supabase client initialized');
  } catch (error) {
    console.log('❌ Failed to initialize Supabase client:', error);
  }
} else {
  console.log('⚠️  Supabase credentials not found - running in demo mode');
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env['NODE_ENV'] || 'development',
    supabase: supabase ? 'connected' : 'demo mode'
  });
});

// Bank routes (demo mode)
app.get('/api/banks/search', async (req: Request, res: Response) => {
  try {
    if (!supabase) {
      // Return demo data with consistent format
      return res.json({
        banks: [
          { 
            id: '1', 
            rssdId: '1234567',
            fdicCertificateNumber: '12345',
            bankName: 'Demo Bank 1', 
            city: 'Los Angeles',
            state: 'CA', 
            totalAssets: 1000000000,
            charterType: 'Commercial Bank',
            regulator: 'OCC',
            isActive: true,
            lastFilingDate: new Date('2023-12-31'),
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-12-31')
          },
          { 
            id: '2', 
            rssdId: '2345678',
            fdicCertificateNumber: '23456',
            bankName: 'Demo Bank 2', 
            city: 'New York',
            state: 'NY', 
            totalAssets: 2000000000,
            charterType: 'Commercial Bank',
            regulator: 'OCC',
            isActive: true,
            lastFilingDate: new Date('2023-12-31'),
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-12-31')
          }
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 2
        }
      });
    }

    const { search, state, charter_type, regulator, min_assets, max_assets, page = 1, limit = 20 } = req.query;

    let query = supabase
      .from('banks')
      .select('*');

    // Apply filters
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    if (state) {
      query = query.eq('state', state);
    }
    if (charter_type) {
      query = query.eq('charter_type', charter_type);
    }
    if (regulator) {
      query = query.eq('regulator', regulator);
    }
    if (min_assets) {
      query = query.gte('assets', parseFloat(min_assets as string));
    }
    if (max_assets) {
      query = query.lte('assets', parseFloat(max_assets as string));
    }

    // Pagination
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    query = query.range(offset, offset + parseInt(limit as string) - 1);

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      banks: data || [],
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: count || 0
      }
    });
  } catch (error) {
    console.error('Error searching banks:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/banks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!supabase) {
      // Return demo data with consistent format
      return res.json({
        id: id,
        rssdId: '1234567',
        fdicCertificateNumber: '12345',
        bankName: `Demo Bank ${id}`,
        city: 'Los Angeles',
        state: 'CA',
        totalAssets: 1000000000,
        charterType: 'Commercial Bank',
        regulator: 'OCC',
        isActive: true,
        lastFilingDate: new Date('2023-12-31'),
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-12-31')
      });
    }

    const { data, error } = await supabase
      .from('banks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Bank not found' });
    }

    return res.json(data);
  } catch (error) {
    console.error('Error getting bank:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Bank selection routes (demo mode)
app.get('/api/banks/selection', async (req: Request, res: Response) => {
  try {
    if (!supabase) {
      // Return demo data with consistent format
      return res.json({
        selectedBanks: [
          { 
            id: '1', 
            rssdId: '1234567',
            fdicCertificateNumber: '12345',
            bankName: 'Demo Bank 1', 
            city: 'Los Angeles',
            state: 'CA', 
            totalAssets: 1000000000,
            charterType: 'Commercial Bank',
            regulator: 'OCC',
            isActive: true,
            lastFilingDate: new Date('2023-12-31'),
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-12-31')
          }
        ],
        count: 1
      });
    }

    const userId = req.headers['user-id'] as string || 'demo-user';

    const { data, error } = await supabase
      .from('bank_selections')
      .select(`
        *,
        banks (*)
      `)
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      selectedBanks: data || [],
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error getting bank selection:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/banks/selection', async (req: Request, res: Response) => {
  try {
    if (!supabase) {
      return res.json({ message: 'Demo mode - selection would be saved' });
    }

    const userId = req.headers['user-id'] as string || 'demo-user';
    const { bankIds } = req.body;

    if (!Array.isArray(bankIds) || bankIds.length > 30) {
      return res.status(400).json({ error: 'Maximum 30 banks allowed' });
    }

    // Clear existing selections
    await supabase
      .from('bank_selections')
      .delete()
      .eq('user_id', userId);

    // Add new selections
    if (bankIds.length > 0) {
      const selections = bankIds.map(bankId => ({
        user_id: userId,
        bank_id: bankId
      }));

      const { error } = await supabase
        .from('bank_selections')
        .insert(selections);

      if (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    return res.json({ message: 'Bank selection updated successfully' });
  } catch (error) {
    console.error('Error updating bank selection:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/banks/selection/add', async (req: Request, res: Response) => {
  try {
    if (!supabase) {
      return res.json({ message: 'Demo mode - bank would be added' });
    }

    const userId = req.headers['user-id'] as string || 'demo-user';
    const { bankId } = req.body;

    // Check current selection count
    const { count } = await supabase
      .from('bank_selections')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (count && count >= 30) {
      return res.status(400).json({ error: 'Maximum 30 banks already selected' });
    }

    // Add bank to selection
    const { error } = await supabase
      .from('bank_selections')
      .insert({
        user_id: userId,
        bank_id: bankId
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ message: 'Bank added to selection' });
  } catch (error) {
    console.error('Error adding bank to selection:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/banks/selection/remove', async (req: Request, res: Response) => {
  try {
    if (!supabase) {
      return res.json({ message: 'Demo mode - bank would be removed' });
    }

    const userId = req.headers['user-id'] as string || 'demo-user';
    const { bankId } = req.body;

    const { error } = await supabase
      .from('bank_selections')
      .delete()
      .eq('user_id', userId)
      .eq('bank_id', bankId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ message: 'Bank removed from selection' });
  } catch (error) {
    console.error('Error removing bank from selection:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/banks/selection/clear', async (req: Request, res: Response) => {
  try {
    if (!supabase) {
      return res.json({ message: 'Demo mode - selection would be cleared' });
    }

    const userId = req.headers['user-id'] as string || 'demo-user';

    const { error } = await supabase
      .from('bank_selections')
      .delete()
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ message: 'Bank selection cleared' });
  } catch (error) {
    console.error('Error clearing bank selection:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Economy Simulator Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Supabase: ${supabase ? 'Connected' : 'Demo Mode'}`);
}); 
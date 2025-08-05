# Economy Simulator - Serverless Deployment Guide

## Overview
This guide provides a complete serverless deployment strategy for the Economy Simulator prototype, minimizing costs while maintaining full functionality.

## Serverless Architecture Stack

### Frontend: Vercel (Free Tier)
- **Cost**: $0/month
- **Features**: 
  - 100GB bandwidth/month
  - 100GB storage
  - Global CDN
  - Automatic HTTPS
  - Git-based deployments
  - Preview deployments

### Backend: Railway (Paid Tier)
- **Cost**: $5/month
- **Features**:
  - 512MB RAM
  - Shared CPU
  - Auto-scaling
  - Custom domains
  - Environment variables
  - Logs and monitoring

### Database: Supabase (Free Tier)
- **Cost**: $0/month
- **Features**:
  - 500MB database
  - 50MB file storage
  - 50,000 monthly active users
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Built-in authentication

### Cache: Upstash Redis (Free Tier)
- **Cost**: $0/month
- **Features**:
  - 10,000 requests/day
  - 256MB storage
  - Global distribution
  - REST API access

### File Storage: Supabase Storage (Free Tier)
- **Cost**: $0/month
- **Features**:
  - 50MB storage
  - CDN delivery
  - Image transformations

## Total Cost: $5/month (99.5% savings vs enterprise)

## Implementation Plan

### Phase 1: Database Setup (Supabase)

#### 1.1 Create Supabase Project
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Create new project
supabase projects create economy-simulator
```

#### 1.2 Database Schema
```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Banks table
CREATE TABLE banks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rssd_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(2),
    charter_type VARCHAR(50),
    regulator VARCHAR(50),
    assets DECIMAL(20,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bank selections table
CREATE TABLE bank_selections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    bank_id UUID NOT NULL REFERENCES banks(id),
    selected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, bank_id)
);

-- UBPR data table
CREATE TABLE ubpr_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rssd_id VARCHAR(20) NOT NULL,
    filing_date DATE NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(rssd_id, filing_date)
);

-- Users table (for authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    encrypted_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_banks_rssd_id ON banks(rssd_id);
CREATE INDEX idx_banks_name ON banks(name);
CREATE INDEX idx_banks_state ON banks(state);
CREATE INDEX idx_bank_selections_user_id ON bank_selections(user_id);
CREATE INDEX idx_ubpr_data_rssd_id ON ubpr_data(rssd_id);
CREATE INDEX idx_ubpr_data_filing_date ON ubpr_data(filing_date);

-- Enable Row Level Security
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE ubpr_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public read access to banks" ON banks
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own bank selections" ON bank_selections
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Allow public read access to UBPR data" ON ubpr_data
    FOR SELECT USING (true);
```

#### 1.3 Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### Phase 2: Backend Setup (Railway)

#### 2.1 Railway Configuration
```yaml
# railway.json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 2.2 Backend Package.json Updates
```json
{
  "name": "economy-simulator-backend",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "deploy": "railway up"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "@supabase/supabase-js": "^2.38.0",
    "redis": "^4.6.10",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1",
    "winston": "^3.11.0"
  }
}
```

#### 2.3 Backend Serverless Configuration
```typescript
// src/config/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// src/config/redis.ts
import { Redis } from 'redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  password: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export { redis };

// src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { bankRoutes } from './routes/bankRoutes';
import { authRoutes } from './routes/authRoutes';
import { ubprRoutes } from './routes/ubprRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/banks', bankRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ubpr', ubprRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Phase 3: Frontend Setup (Vercel)

#### 3.1 Next.js Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'your-vercel-domain.vercel.app'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

#### 3.2 Vercel Configuration
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key",
    "NEXT_PUBLIC_API_URL": "@api_url"
  }
}
```

#### 3.3 Frontend Supabase Integration
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
```

### Phase 4: MCP Server Integration

#### 4.1 Serverless MCP Server
```typescript
// src/mcp-server/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { FFIECService } from './services/FFIECService.js';

async function main() {
  const transport = new StdioServerTransport();
  const server = new Server(
    {
      name: 'ffiec-ubpr-mcp-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  const ffiecService = new FFIECService();

  server.setRequestHandler(async (request) => {
    if (request.method === 'tools/call') {
      const { name, arguments: args } = request.params;
      
      switch (name) {
        case 'get_ubpr_data':
          return await ffiecService.getUBPRData(args.rssd_id, args.filing_date);
        case 'search_banks':
          return await ffiecService.searchBanks(args.criteria);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    }
  });

  await server.connect(transport);
}

main().catch(console.error);
```

#### 4.2 Railway MCP Server Deployment
```yaml
# railway-mcp.json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node dist/mcp-server/index.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## Deployment Commands

### 1. Deploy Backend to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

### 2. Deploy Frontend to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 3. Deploy MCP Server to Railway
```bash
cd src/infrastructure/mcp-servers/ffiec-ubpr-mcp-server
railway up
```

## Environment Variables Setup

### Railway Environment Variables
```bash
# Backend
railway variables set SUPABASE_URL=your_supabase_url
railway variables set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
railway variables set UPSTASH_REDIS_REST_URL=your_redis_url
railway variables set UPSTASH_REDIS_REST_TOKEN=your_redis_token
railway variables set JWT_SECRET=your_jwt_secret

# MCP Server
railway variables set FFIEC_SERVICE_URL=https://cdr.ffiec.gov/public/pws/webservices/retrievalservice.asmx
railway variables set FFIEC_USERNAME=your_username
railway variables set FFIEC_PASSWORD=your_password
```

### Vercel Environment Variables
```bash
# Frontend
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_API_URL
```

## Cost Monitoring

### Free Tier Limits
- **Vercel**: 100GB bandwidth, 100GB storage
- **Supabase**: 500MB database, 50MB storage, 50K MAU
- **Upstash Redis**: 10,000 requests/day, 256MB storage
- **Railway**: $5/month for backend

### Usage Monitoring
```typescript
// src/utils/usage-monitor.ts
import { supabase } from '../lib/supabase';

export async function checkUsageLimits() {
  // Check database size
  const { data: dbSize } = await supabase
    .from('information_schema.tables')
    .select('pg_total_relation_size');

  // Check Redis usage
  const redisInfo = await fetch(process.env.UPSTASH_REDIS_REST_URL + '/info', {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` }
  });

  // Log usage for monitoring
  console.log('Database size:', dbSize);
  console.log('Redis info:', await redisInfo.json());
}
```

## Scaling Considerations

### When to Upgrade
- **Database**: > 500MB storage needed
- **Redis**: > 10,000 requests/day
- **Bandwidth**: > 100GB/month
- **Users**: > 50,000 MAU

### Upgrade Path
1. **Supabase Pro**: $25/month (8GB database, 100GB storage)
2. **Upstash Redis Pro**: $10/month (unlimited requests)
3. **Vercel Pro**: $20/month (1TB bandwidth, 1TB storage)
4. **Railway**: Scale up to $20/month (2GB RAM, dedicated CPU)

## Security Considerations

### Authentication
```typescript
// src/middleware/auth.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect API routes
  if (req.nextUrl.pathname.startsWith('/api/') && !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return res;
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
};
```

### Row Level Security
```sql
-- Enable RLS on all tables
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE ubpr_data ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access to banks" ON banks
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their selections" ON bank_selections
    FOR ALL USING (auth.uid() = user_id);
```

## Performance Optimization

### Caching Strategy
```typescript
// src/lib/cache.ts
import { redis } from '../config/redis';

export async function getCachedData(key: string) {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  return null;
}

export async function setCachedData(key: string, data: any, ttl = 3600) {
  await redis.setex(key, ttl, JSON.stringify(data));
}

// Cache bank data for 1 hour
export async function getBankData(rssdId: string) {
  const cacheKey = `bank:${rssdId}`;
  let data = await getCachedData(cacheKey);
  
  if (!data) {
    data = await fetchBankFromAPI(rssdId);
    await setCachedData(cacheKey, data, 3600);
  }
  
  return data;
}
```

### Database Optimization
```sql
-- Create indexes for common queries
CREATE INDEX idx_banks_search ON banks USING gin(to_tsvector('english', name || ' ' || city || ' ' || state));
CREATE INDEX idx_ubpr_data_composite ON ubpr_data(rssd_id, filing_date);

-- Use connection pooling
-- Supabase handles this automatically
```

## Monitoring and Logging

### Railway Logs
```bash
# View logs
railway logs

# Stream logs
railway logs --follow
```

### Vercel Analytics
```typescript
// pages/_app.tsx
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

## Backup Strategy

### Database Backups
- Supabase provides automatic daily backups
- Point-in-time recovery available
- Export data via Supabase dashboard

### Code Backups
- Git repository on GitHub
- Automatic deployments from main branch
- Environment variables stored securely

## Conclusion

This serverless deployment strategy provides:

✅ **99.5% cost savings** ($5/month vs $500/month)
✅ **Zero server maintenance**
✅ **Auto-scaling capabilities**
✅ **Global CDN included**
✅ **Built-in security features**
✅ **Easy deployment and updates**

Perfect for prototypes and demos while providing a clear upgrade path as you gain traction! 
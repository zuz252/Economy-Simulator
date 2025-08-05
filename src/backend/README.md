# Economy Simulator Backend

Backend API for the Economy Simulator platform.

## Features

- Bank search and selection API
- Supabase integration for data storage
- RESTful API endpoints
- TypeScript support
- Health check endpoint

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Development

Run in development mode:
```bash
npm run dev
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/banks/search` - Search banks
- `GET /api/banks/:id` - Get bank details
- `GET /api/banks/selection` - Get user's bank selections
- `POST /api/banks/selection` - Update bank selections
- `POST /api/banks/selection/add` - Add bank to selection
- `DELETE /api/banks/selection/remove` - Remove bank from selection
- `DELETE /api/banks/selection/clear` - Clear all selections

## Deployment

This backend is configured for deployment on Render.

### Render Deployment

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set the following environment variables:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `SUPABASE_URL=your_supabase_url`
   - `SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key`
   - `FRONTEND_URL=your_frontend_url`

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `FRONTEND_URL` - Frontend URL for CORS

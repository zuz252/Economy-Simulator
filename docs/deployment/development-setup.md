# Development Setup Guide

This guide will help you set up the Economy Simulator development environment on your local machine.

## Prerequisites

### Required Software
- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher
- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Git**: Latest version

### Optional Software
- **PostgreSQL**: Version 14 or higher (if not using Docker)
- **Redis**: Version 7 or higher (if not using Docker)
- **VS Code**: Recommended IDE with extensions

### VS Code Extensions (Recommended)
- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Docker
- GitLens
- REST Client

## Initial Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Economy-Simulator
```

### 2. Install Root Dependencies
```bash
npm install
```

### 3. Install All Workspace Dependencies
```bash
npm run install:all
```

### 4. Environment Configuration

#### Create Environment Files
```bash
# Backend environment
cp src/backend/.env.example src/backend/.env

# Frontend environment
cp src/frontend/.env.example src/frontend/.env

# MCP Server environment
cp src/infrastructure/mcp-servers/ffiec-ubpr-mcp-server/config/env.example src/infrastructure/mcp-servers/ffiec-ubpr-mcp-server/.env
```

#### Configure Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://economy_user:economy_password@localhost:5432/economy_simulator
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_here
MCP_SERVER_URL=http://localhost:3001
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_MCP_SERVER_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
```

**MCP Server (.env)**
```env
FFIEC_SERVICE_URL=https://cdr.ffiec.gov/public/pws/webservices/retrievalservice.asmx
FFIEC_USERNAME=your_ffiec_username
FFIEC_PASSWORD=your_ffiec_password
NODE_ENV=development
LOG_LEVEL=info
```

## Development Workflow

### Option 1: Docker Development (Recommended)

#### Start All Services
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Individual Service Management
```bash
# Start specific services
docker-compose up -d postgres redis

# Rebuild and restart a service
docker-compose up -d --build backend

# View service logs
docker-compose logs -f backend
```

### Option 2: Local Development

#### Start Infrastructure Services
```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Or use local installations
# PostgreSQL: sudo systemctl start postgresql
# Redis: sudo systemctl start redis
```

#### Start Application Services

**Terminal 1 - MCP Server**
```bash
cd src/infrastructure/mcp-servers/ffiec-ubpr-mcp-server
npm run dev
```

**Terminal 2 - Backend**
```bash
cd src/backend
npm run dev
```

**Terminal 3 - Frontend**
```bash
cd src/frontend
npm run dev
```

### Option 3: Combined Development
```bash
# Start all services from root
npm run dev
```

## Database Setup

### Using Docker (Recommended)
```bash
# Database is automatically initialized with Docker Compose
docker-compose up -d postgres

# Run migrations (if needed)
cd src/backend
npm run migrate
```

### Using Local PostgreSQL
```bash
# Create database
createdb economy_simulator

# Create user (if needed)
createuser -P economy_user

# Grant privileges
psql -d economy_simulator -c "GRANT ALL PRIVILEGES ON DATABASE economy_simulator TO economy_user;"
```

## Testing

### Run All Tests
```bash
npm run test
```

### Run Specific Test Suites
```bash
# Backend tests
npm run test:backend

# Frontend tests
npm run test:frontend

# MCP Server tests
npm run test:mcp
```

### Test with Coverage
```bash
# All coverage
npm run test:coverage

# Individual coverage
cd src/backend && npm run test:coverage
cd src/frontend && npm run test:coverage
cd src/infrastructure/mcp-servers/ffiec-ubpr-mcp-server && npm run test:coverage
```

## Code Quality

### Linting
```bash
# Lint all code
npm run lint

# Lint specific components
npm run lint:backend
npm run lint:frontend
npm run lint:mcp
```

### Formatting
```bash
# Format all code
npm run format

# Format specific components
npm run format:backend
npm run format:frontend
npm run format:mcp
```

### Type Checking
```bash
# Check types in all components
cd src/backend && npm run type-check
cd src/frontend && npm run type-check
cd src/infrastructure/mcp-servers/ffiec-ubpr-mcp-server && npm run type-check
```

## Building

### Build All Components
```bash
npm run build
```

### Build Individual Components
```bash
npm run build:backend
npm run build:frontend
npm run build:mcp
```

## Monitoring and Logs

### Access Monitoring Tools
- **Grafana**: http://localhost:3003 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Kibana**: http://localhost:5601
- **Elasticsearch**: http://localhost:9200

### View Logs
```bash
# Docker logs
docker-compose logs -f

# Individual service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mcp-server

# Application logs
tail -f logs/combined.log
tail -f logs/error.log
```

## Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check what's using a port
sudo lsof -i :3000
sudo lsof -i :3001
sudo lsof -i :3002

# Kill process using port
sudo kill -9 <PID>
```

#### Docker Issues
```bash
# Clean up Docker
docker system prune -a
docker volume prune

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

#### Database Issues
```bash
# Reset database
docker-compose down -v
docker-compose up -d postgres

# Or for local PostgreSQL
dropdb economy_simulator
createdb economy_simulator
```

#### Node Modules Issues
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

### Performance Optimization

#### Development Performance
```bash
# Use nodemon for backend (already configured)
# Use React Fast Refresh for frontend (already configured)
# Use TypeScript incremental compilation
```

#### Memory Management
```bash
# Monitor memory usage
docker stats

# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
```

## Next Steps

1. **Set up FFIEC credentials** in the MCP server environment
2. **Configure database connections** for your environment
3. **Set up monitoring** and logging preferences
4. **Review the architecture documentation** in `/docs/architecture/`
5. **Explore the API documentation** in `/docs/api/`
6. **Check the PRD** in `/economy-simulator-prd/` for feature requirements

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the logs for error messages
3. Check the documentation in `/docs/`
4. Create an issue in the repository
5. Contact the development team 
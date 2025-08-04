# Economy Simulator

A comprehensive economic simulation platform that models banking systems, financial markets, and economic interactions using real-world data and advanced simulation techniques.

## Project Structure

```
Economy-Simulator/
├── economy-simulator-prd/          # Product Requirements & Documentation
│   └── prd/                       # Product requirements documents
├── src/                           # Source Code
│   ├── backend/                   # Backend Services
│   │   ├── api/                   # API endpoints and controllers
│   │   ├── services/              # Business logic services
│   │   ├── database/              # Database models and migrations
│   │   ├── models/                # Data models
│   │   └── utils/                 # Backend utilities
│   ├── frontend/                  # Frontend Application
│   │   ├── components/            # React/Vue components
│   │   ├── pages/                 # Page components
│   │   ├── utils/                 # Frontend utilities
│   │   └── styles/                # CSS/SCSS styles
│   ├── shared/                    # Shared Code
│   │   ├── types/                 # TypeScript type definitions
│   │   ├── constants/             # Shared constants
│   │   └── utils/                 # Shared utilities
│   └── infrastructure/            # Infrastructure Components
│       ├── mcp-servers/           # Model Context Protocol servers
│       │   └── ffiec-ubpr-mcp-server/  # FFIEC UBPR data server
│       ├── data-pipelines/        # Data processing pipelines
│       └── monitoring/            # Monitoring and observability
├── docs/                          # Documentation
│   ├── api/                       # API documentation
│   ├── architecture/              # System architecture docs
│   ├── deployment/                # Deployment guides
│   └── user-guides/               # User documentation
├── tests/                         # Test Suites
│   ├── unit/                      # Unit tests
│   ├── integration/               # Integration tests
│   └── e2e/                       # End-to-end tests
├── deployment/                    # Deployment Configuration
│   ├── docker/                    # Docker configurations
│   ├── kubernetes/                # Kubernetes manifests
│   └── terraform/                 # Infrastructure as Code
└── README.md                      # This file
```

## Features

### Core Simulation Engine
- **Banking System Simulation**: Model individual banks and banking networks
- **Financial Market Simulation**: Simulate market dynamics and interactions
- **Economic Agent Modeling**: Represent various economic actors and their behaviors
- **Regulatory Framework**: Implement banking regulations and compliance

### Data Integration
- **FFIEC UBPR Data**: Real bank performance data via MCP server
- **Market Data**: Real-time and historical market data
- **Economic Indicators**: GDP, inflation, employment data
- **Regulatory Data**: Banking regulations and compliance requirements

### Analysis & Visualization
- **Performance Analytics**: Bank performance analysis and benchmarking
- **Risk Assessment**: Credit risk, market risk, and operational risk modeling
- **Scenario Analysis**: What-if scenarios and stress testing
- **Interactive Dashboards**: Real-time simulation monitoring

## Technology Stack

### Backend
- **Language**: TypeScript/Node.js
- **Framework**: Express.js or Fastify
- **Database**: PostgreSQL with TimescaleDB for time-series data
- **Message Queue**: Redis/RabbitMQ for async processing
- **API**: RESTful APIs with GraphQL support

### Frontend
- **Framework**: React with TypeScript
- **State Management**: Redux Toolkit or Zustand
- **UI Library**: Material-UI or Ant Design
- **Charts**: D3.js or Chart.js for data visualization
- **Real-time**: WebSocket connections for live updates

### Infrastructure
- **MCP Servers**: Model Context Protocol for data integration
- **Containerization**: Docker for consistent deployments
- **Orchestration**: Kubernetes for scalable deployments
- **Monitoring**: Prometheus, Grafana, and ELK stack
- **CI/CD**: GitHub Actions or GitLab CI

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker and Docker Compose
- FFIEC CDR service account (for UBPR data)

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Economy-Simulator
   ```

2. **Install dependencies**:
   ```bash
   # Backend dependencies
   cd src/backend && npm install
   
   # Frontend dependencies
   cd ../frontend && npm install
   
   # MCP Server dependencies
   cd ../infrastructure/mcp-servers/ffiec-ubpr-mcp-server && npm install
   ```

3. **Set up environment variables**:
   ```bash
   # Copy example environment files
   cp src/backend/.env.example src/backend/.env
   cp src/frontend/.env.example src/frontend/.env
   cp src/infrastructure/mcp-servers/ffiec-ubpr-mcp-server/config/env.example src/infrastructure/mcp-servers/ffiec-ubpr-mcp-server/.env
   ```

4. **Start development services**:
   ```bash
   # Start MCP server
   cd src/infrastructure/mcp-servers/ffiec-ubpr-mcp-server
   npm run dev
   
   # Start backend (in new terminal)
   cd src/backend
   npm run dev
   
   # Start frontend (in new terminal)
   cd src/frontend
   npm run dev
   ```

### Docker Setup

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Development Workflow

### Code Organization
- **Feature Development**: Create feature branches from `main`
- **Code Review**: All changes require pull request review
- **Testing**: Unit, integration, and e2e tests required
- **Documentation**: Update docs for new features

### Testing
```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

## Documentation

- **API Documentation**: `/docs/api/`
- **Architecture**: `/docs/architecture/`
- **Deployment**: `/docs/deployment/`
- **User Guides**: `/docs/user-guides/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Update documentation
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions and support:
- Create an issue in the repository
- Check the documentation in `/docs/`
- Review the PRD in `/economy-simulator-prd/` 
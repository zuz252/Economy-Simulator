# FFIEC UBPR MCP Server

A Model Context Protocol (MCP) server for interacting with the FFIEC CDR Public Data Distribution Service to retrieve UBPR (Uniform Bank Performance Report) data.

## Overview

This MCP server provides a standardized interface for accessing UBPR data from the Federal Financial Institutions Examination Council (FFIEC) through their public web service. It enables easy integration with AI models and applications that need access to comprehensive bank performance data.

## Features

- **MCP Protocol Compliance**: Full implementation of the Model Context Protocol
- **FFIEC Service Integration**: Direct integration with FFIEC CDR Public Data Distribution Service
- **Comprehensive UBPR Data**: Access to all UBPR components including:
  - Balance Sheet data
  - Income Statement data
  - Performance Ratios
  - Capital Adequacy metrics
  - Asset Quality indicators
  - Liquidity ratios
  - Loan Portfolio composition
  - Deposit Structure analysis
  - Securities Portfolio details
- **Resource Management**: List, read, and search UBPR resources
- **Tool Integration**: Execute FFIEC service operations through MCP tools
- **Error Handling**: Robust error handling and logging
- **Authentication**: Secure FFIEC service authentication

## Prerequisites

- Node.js 18+ 
- FFIEC CDR Public Data Distribution Service account
- TypeScript knowledge for development

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment configuration:
```bash
cp config/env.example .env
```

4. Configure your FFIEC credentials in `.env`:
```env
FFIEC_USERNAME=your_ffiec_username
FFIEC_PASSWORD=your_ffiec_password
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FFIEC_SERVICE_URL` | FFIEC web service URL | `https://cdr.ffiec.gov/public/pws/webservices/retrievalservice.asmx` |
| `FFIEC_USERNAME` | FFIEC account username | Required |
| `FFIEC_PASSWORD` | FFIEC account password | Required |
| `NODE_ENV` | Environment mode | `development` |
| `LOG_LEVEL` | Logging level | `info` |
| `FFIEC_RATE_LIMIT_REQUESTS_PER_MINUTE` | Rate limit per minute | `60` |
| `FFIEC_RATE_LIMIT_REQUESTS_PER_HOUR` | Rate limit per hour | `1000` |
| `FFIEC_REQUEST_TIMEOUT` | Request timeout (ms) | `30000` |
| `FFIEC_RETRY_ATTEMPTS` | Retry attempts | `3` |

## Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Testing

```bash
npm test
```

## MCP Protocol Implementation

### Resources

The server provides the following resource types:

- **Reporting Periods**: `ffiec://reporting-periods/{period}`
- **Bank Data**: `ffiec://banks/{rssdId}/{reportingPeriod}`

### Tools

Available MCP tools:

1. **`get_ubpr_data`**: Retrieve comprehensive UBPR data
   - Parameters: `rssdId`, `reportingPeriod`, `dataType`
   
2. **`get_reporting_periods`**: Get available reporting periods
   - Parameters: None
   
3. **`get_panel_reporters`**: Get banks that filed reports
   - Parameters: `reportingPeriod`
   
4. **`test_connection`**: Test FFIEC service connection
   - Parameters: None

### Example Usage

#### Initialize the server:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": {
      "name": "test-client",
      "version": "1.0.0"
    },
    "arguments": {
      "ffiecCredentials": {
        "username": "your_username",
        "password": "your_password"
      },
      "ffiecConfig": {
        "url": "https://cdr.ffiec.gov/public/pws/webservices/retrievalservice.asmx",
        "timeout": 30000,
        "retryAttempts": 3,
        "rateLimit": {
          "requestsPerMinute": 60,
          "requestsPerHour": 1000
        }
      }
    }
  }
}
```

#### List resources:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "resources/list",
  "params": {
    "arguments": {
      "reportingPeriod": "2024-03-31"
    }
  }
}
```

#### Call a tool:
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "arguments": {
      "name": "get_ubpr_data",
      "arguments": {
        "rssdId": "1234567",
        "reportingPeriod": "2024-03-31",
        "dataType": "quarterly"
      }
    }
  }
}
```

## Data Structure

### UBPR Comprehensive Data

The server returns comprehensive UBPR data including:

```typescript
interface UBPRComprehensiveData {
  rssdId: string;
  reportingPeriod: string;
  filingDate: string;
  balanceSheet: UBPRBalanceSheet;
  incomeStatement: UBPRIncomeStatement;
  performanceRatios: UBPRPerformanceRatios;
  capitalAdequacy: UBPRCapitalAdequacy;
  assetQuality: UBPRAssetQuality;
  liquidity: UBPRLiquidity;
  loanPortfolio: UBPRLoanPortfolio;
  depositStructure: UBPRDepositStructure;
  securitiesPortfolio: UBPRSecuritiesPortfolio;
}
```

## Error Handling

The server provides detailed error responses with:

- Error codes for different failure types
- Descriptive error messages
- Additional error details when available
- Proper HTTP status codes

## Logging

Logs are written to:
- Console (development)
- `logs/error.log` (error level)
- `logs/combined.log` (all levels)

## Development

### Project Structure

```
mcp-server/
├── src/
│   ├── handlers/          # MCP protocol handlers
│   ├── services/          # FFIEC service integration
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── index.ts          # Main entry point
├── config/               # Configuration files
├── tests/                # Test files
├── logs/                 # Log files (created at runtime)
└── dist/                 # Compiled output
```

### Adding New Features

1. **New UBPR Components**: Add to `types/ffiec.ts`
2. **New Tools**: Add to `handlers/MCPHandlers.ts`
3. **New Services**: Add to `services/` directory
4. **Tests**: Add corresponding test files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue in the repository
- Check the logs for detailed error information
- Verify FFIEC service credentials and connectivity

## Security

- Credentials are stored in environment variables
- No sensitive data is logged
- HTTPS is used for all FFIEC service communication
- Rate limiting prevents service abuse 
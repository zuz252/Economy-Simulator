import { spawn } from 'child_process';
import { EventEmitter } from 'events';

interface MCPRequest {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params: any;
}

interface MCPResponse {
  jsonrpc: '2.0';
  id: number;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

class MCPClient extends EventEmitter {
  private process: any;
  private requestId = 1;

  constructor(serverPath: string) {
    super();
    this.process = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    this.process.stdout.on('data', (data: Buffer) => {
      const lines = data.toString().split('\n').filter(line => line.trim());
      for (const line of lines) {
        try {
          const response: MCPResponse = JSON.parse(line);
          this.emit('response', response);
        } catch (error) {
          console.error('Failed to parse response:', line);
        }
      }
    });

    this.process.stderr.on('data', (data: Buffer) => {
      console.error('Server error:', data.toString());
    });

    this.process.on('close', (code: number) => {
      console.log(`Server process exited with code ${code}`);
    });
  }

  private sendRequest(method: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        id: this.requestId++,
        method,
        params
      };

      const requestStr = JSON.stringify(request) + '\n';
      this.process.stdin.write(requestStr);

      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 30000);

      const responseHandler = (response: MCPResponse) => {
        if (response.id === request.id) {
          clearTimeout(timeout);
          this.removeListener('response', responseHandler);
          
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response.result);
          }
        }
      };

      this.on('response', responseHandler);
    });
  }

  async initialize(ffiecCredentials: any, ffiecConfig: any): Promise<any> {
    return this.sendRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'example-client',
        version: '1.0.0'
      },
      arguments: {
        ffiecCredentials,
        ffiecConfig
      }
    });
  }

  async listResources(reportingPeriod?: string): Promise<any> {
    return this.sendRequest('resources/list', {
      arguments: reportingPeriod ? { reportingPeriod } : {}
    });
  }

  async readResource(uri: string): Promise<any> {
    return this.sendRequest('resources/read', {
      arguments: { uri }
    });
  }

  async searchResources(query: string, reportingPeriod: string): Promise<any> {
    return this.sendRequest('resources/search', {
      arguments: { query, reportingPeriod }
    });
  }

  async listTools(): Promise<any> {
    return this.sendRequest('tools/list', {});
  }

  async callTool(name: string, arguments: any): Promise<any> {
    return this.sendRequest('tools/call', {
      arguments: { name, arguments }
    });
  }

  close(): void {
    this.process.kill();
  }
}

// Example usage
async function main() {
  const client = new MCPClient('./dist/index.js');

  try {
    // Initialize the server
    console.log('Initializing MCP server...');
    await client.initialize(
      {
        username: process.env.FFIEC_USERNAME || 'your_username',
        password: process.env.FFIEC_PASSWORD || 'your_password'
      },
      {
        url: 'https://cdr.ffiec.gov/public/pws/webservices/retrievalservice.asmx',
        timeout: 30000,
        retryAttempts: 3,
        rateLimit: {
          requestsPerMinute: 60,
          requestsPerHour: 1000
        }
      }
    );
    console.log('Server initialized successfully');

    // List available tools
    console.log('\nListing available tools...');
    const tools = await client.listTools();
    console.log('Available tools:', tools);

    // Test connection
    console.log('\nTesting connection...');
    const connectionTest = await client.callTool('test_connection', {});
    console.log('Connection test result:', connectionTest);

    // Get reporting periods
    console.log('\nGetting reporting periods...');
    const periods = await client.callTool('get_reporting_periods', {});
    console.log('Reporting periods:', periods);

    // List resources for a specific period
    if (periods.content && periods.content[0]) {
      const periodsData = JSON.parse(periods.content[0].text);
      if (periodsData.length > 0) {
        const latestPeriod = periodsData[0].reportingPeriod;
        console.log(`\nListing resources for period: ${latestPeriod}`);
        const resources = await client.listResources(latestPeriod);
        console.log('Resources:', resources);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.close();
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { MCPClient }; 
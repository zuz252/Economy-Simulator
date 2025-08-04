import {
  Server,
  ServerTransport,
  StdioServerTransport,
  WebSocketServerTransport,
  CallRequest,
  ListResourcesRequest,
  ReadResourceRequest,
  SearchRequest,
  ToolsRequest,
  InitializeRequest,
  InitializeResult,
  ListResourcesResult,
  ReadResourceResult,
  SearchResult,
  ToolsResult,
  CallResult,
  ErrorCode,
  TextContent,
  ImageContent,
  EmbeddedResource,
  Resource,
  Tool,
  TextDiff,
  LoggingLevel
} from '@modelcontextprotocol/sdk/server/index.js';
import { FFIECService } from '../services/FFIECService';
import { logger } from '../utils/logger';
import {
  FFIECCredentials,
  FFIECServiceConfig,
  UBPRDataRequest,
  UBPRComprehensiveData
} from '../types/ffiec';

export class MCPHandlers {
  private server: Server;
  private ffiecService: FFIECService | null = null;
  private isInitialized = false;

  constructor(transport: ServerTransport) {
    this.server = new Server(
      {
        name: 'ffiec-ubpr-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {
            listChanged: true,
          },
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.server.connect(transport);
  }

  private setupHandlers(): void {
    // Initialize handler
    this.server.onRequest('initialize', async (request: InitializeRequest): Promise<InitializeResult> => {
      try {
        logger.info('Initializing MCP server...');
        
        const { arguments: args } = request;
        const { ffiecCredentials, ffiecConfig } = args as any;

        if (!ffiecCredentials || !ffiecConfig) {
          throw new Error('FFIEC credentials and configuration are required');
        }

        // Initialize FFIEC service
        this.ffiecService = new FFIECService(ffiecConfig, ffiecCredentials);
        const initResult = await this.ffiecService.initialize();

        if (!initResult.success) {
          throw new Error(`FFIEC service initialization failed: ${initResult.error?.message}`);
        }

        this.isInitialized = true;
        logger.info('MCP server initialized successfully');

        return {
          protocolVersion: '2024-11-05',
          capabilities: {
            resources: {
              listChanged: true,
            },
            tools: {},
          },
          serverInfo: {
            name: 'ffiec-ubpr-mcp-server',
            version: '1.0.0',
          },
        };
      } catch (error) {
        logger.error('Failed to initialize MCP server', error);
        throw new Error(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    // List resources handler
    this.server.onRequest('resources/list', async (request: ListResourcesRequest): Promise<ListResourcesResult> => {
      try {
        if (!this.isInitialized || !this.ffiecService) {
          throw new Error('Server not initialized');
        }

        const { arguments: args } = request;
        const { reportingPeriod } = args as any;

        // Get available reporting periods
        const periodsResult = await this.ffiecService.getReportingPeriods();
        if (!periodsResult.success) {
          throw new Error(`Failed to get reporting periods: ${periodsResult.error?.message}`);
        }

        const resources: Resource[] = periodsResult.data?.map(period => ({
          uri: `ffiec://reporting-periods/${period.reportingPeriod}`,
          name: `UBPR Reporting Period: ${period.reportingPeriod}`,
          description: period.description,
          mimeType: 'application/json',
        })) || [];

        // If a specific reporting period is requested, also list banks
        if (reportingPeriod) {
          const reportersResult = await this.ffiecService.getPanelOfReporters(reportingPeriod);
          if (reportersResult.success && reportersResult.data) {
            const bankResources = reportersResult.data.map(reporter => ({
              uri: `ffiec://banks/${reporter.rssdId}/${reportingPeriod}`,
              name: `${reporter.bankName} (${reporter.rssdId})`,
              description: `${reporter.bankName} - ${reporter.city}, ${reporter.state}`,
              mimeType: 'application/json',
            }));
            resources.push(...bankResources);
          }
        }

        return { resources };
      } catch (error) {
        logger.error('Failed to list resources', error);
        throw new Error(`Failed to list resources: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    // Read resource handler
    this.server.onRequest('resources/read', async (request: ReadResourceRequest): Promise<ReadResourceResult> => {
      try {
        if (!this.isInitialized || !this.ffiecService) {
          throw new Error('Server not initialized');
        }

        const { uri } = request.arguments;

        // Parse URI to determine what data to retrieve
        const uriParts = uri.split('/');
        
        if (uriParts[1] === 'banks' && uriParts.length >= 4) {
          // Format: ffiec://banks/{rssdId}/{reportingPeriod}
          const rssdId = uriParts[2];
          const reportingPeriod = uriParts[3];

          const ubprRequest: UBPRDataRequest = {
            rssdId,
            reportingPeriod,
            dataType: 'quarterly' // Default to quarterly, could be made configurable
          };

          const ubprResult = await this.ffiecService.getUBPRData(ubprRequest);
          if (!ubprResult.success) {
            throw new Error(`Failed to retrieve UBPR data: ${ubprResult.error?.message}`);
          }

          return {
            contents: [{
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(ubprResult.data, null, 2),
            }],
          };
        } else if (uriParts[1] === 'reporting-periods' && uriParts.length >= 3) {
          // Format: ffiec://reporting-periods/{reportingPeriod}
          const reportingPeriod = uriParts[2];
          
          // Get panel of reporters for this period
          const reportersResult = await this.ffiecService.getPanelOfReporters(reportingPeriod);
          if (!reportersResult.success) {
            throw new Error(`Failed to retrieve reporters: ${reportersResult.error?.message}`);
          }

          return {
            contents: [{
              uri,
              mimeType: 'application/json',
              text: JSON.stringify({
                reportingPeriod,
                reporters: reportersResult.data,
              }, null, 2),
            }],
          };
        }

        throw new Error(`Unsupported URI format: ${uri}`);
      } catch (error) {
        logger.error('Failed to read resource', error);
        throw new Error(`Failed to read resource: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    // Search handler
    this.server.onRequest('resources/search', async (request: SearchRequest): Promise<SearchResult> => {
      try {
        if (!this.isInitialized || !this.ffiecService) {
          throw new Error('Server not initialized');
        }

        const { arguments: args } = request;
        const { query, reportingPeriod } = args as any;

        if (!query || !reportingPeriod) {
          throw new Error('Query and reporting period are required for search');
        }

        // Get panel of reporters and filter by query
        const reportersResult = await this.ffiecService.getPanelOfReporters(reportingPeriod);
        if (!reportersResult.success) {
          throw new Error(`Failed to retrieve reporters: ${reportersResult.error?.message}`);
        }

        // Filter reporters based on query (bank name, city, state, or RSSD ID)
        const filteredReporters = reportersResult.data?.filter(reporter => 
          reporter.bankName.toLowerCase().includes(query.toLowerCase()) ||
          reporter.city.toLowerCase().includes(query.toLowerCase()) ||
          reporter.state.toLowerCase().includes(query.toLowerCase()) ||
          reporter.rssdId.includes(query)
        ) || [];

        const resources: Resource[] = filteredReporters.map(reporter => ({
          uri: `ffiec://banks/${reporter.rssdId}/${reportingPeriod}`,
          name: `${reporter.bankName} (${reporter.rssdId})`,
          description: `${reporter.bankName} - ${reporter.city}, ${reporter.state}`,
          mimeType: 'application/json',
        }));

        return { resources };
      } catch (error) {
        logger.error('Failed to search resources', error);
        throw new Error(`Failed to search resources: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    // Tools handler
    this.server.onRequest('tools/list', async (): Promise<ToolsResult> => {
      const tools: Tool[] = [
        {
          name: 'get_ubpr_data',
          description: 'Retrieve comprehensive UBPR data for a specific bank and reporting period',
          inputSchema: {
            type: 'object',
            properties: {
              rssdId: {
                type: 'string',
                description: 'Bank RSSD identifier'
              },
              reportingPeriod: {
                type: 'string',
                description: 'Reporting period (YYYY-MM-DD format)'
              },
              dataType: {
                type: 'string',
                enum: ['quarterly', 'annual'],
                description: 'Type of data to retrieve'
              }
            },
            required: ['rssdId', 'reportingPeriod']
          }
        },
        {
          name: 'get_reporting_periods',
          description: 'Get available UBPR reporting periods',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          }
        },
        {
          name: 'get_panel_reporters',
          description: 'Get list of banks that filed UBPR reports for a specific period',
          inputSchema: {
            type: 'object',
            properties: {
              reportingPeriod: {
                type: 'string',
                description: 'Reporting period (YYYY-MM-DD format)'
              }
            },
            required: ['reportingPeriod']
          }
        },
        {
          name: 'test_connection',
          description: 'Test FFIEC service connection and authentication',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          }
        }
      ];

      return { tools };
    });

    // Call tool handler
    this.server.onRequest('tools/call', async (request: ToolsRequest): Promise<CallResult> => {
      try {
        if (!this.isInitialized || !this.ffiecService) {
          throw new Error('Server not initialized');
        }

        const { arguments: args } = request;
        const { name, arguments: toolArgs } = args;

        switch (name) {
          case 'get_ubpr_data': {
            const { rssdId, reportingPeriod, dataType = 'quarterly' } = toolArgs as any;
            
            if (!rssdId || !reportingPeriod) {
              throw new Error('rssdId and reportingPeriod are required');
            }

            const ubprRequest: UBPRDataRequest = { rssdId, reportingPeriod, dataType };
            const result = await this.ffiecService.getUBPRData(ubprRequest);

            if (!result.success) {
              throw new Error(`Failed to retrieve UBPR data: ${result.error?.message}`);
            }

            return {
              content: [{
                type: 'text',
                text: JSON.stringify(result.data, null, 2)
              }]
            };
          }

          case 'get_reporting_periods': {
            const result = await this.ffiecService.getReportingPeriods();
            
            if (!result.success) {
              throw new Error(`Failed to get reporting periods: ${result.error?.message}`);
            }

            return {
              content: [{
                type: 'text',
                text: JSON.stringify(result.data, null, 2)
              }]
            };
          }

          case 'get_panel_reporters': {
            const { reportingPeriod } = toolArgs as any;
            
            if (!reportingPeriod) {
              throw new Error('reportingPeriod is required');
            }

            const result = await this.ffiecService.getPanelOfReporters(reportingPeriod);
            
            if (!result.success) {
              throw new Error(`Failed to get panel reporters: ${result.error?.message}`);
            }

            return {
              content: [{
                type: 'text',
                text: JSON.stringify(result.data, null, 2)
              }]
            };
          }

          case 'test_connection': {
            const result = await this.ffiecService.testUserAccess();
            
            return {
              content: [{
                type: 'text',
                text: JSON.stringify({
                  success: result.success,
                  message: result.success ? 'Connection test successful' : result.error?.message
                }, null, 2)
              }]
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        logger.error('Failed to call tool', error);
        throw new Error(`Tool call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  }

  async shutdown(): Promise<void> {
    if (this.ffiecService) {
      await this.ffiecService.disconnect();
    }
    logger.info('MCP server shutdown complete');
  }
} 
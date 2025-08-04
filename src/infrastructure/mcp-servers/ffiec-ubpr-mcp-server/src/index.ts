import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/index.js';
import { MCPHandlers } from './handlers/MCPHandlers';
import { logger } from './utils/logger';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main(): Promise<void> {
  try {
    logger.info('Starting FFIEC UBPR MCP Server...');

    // Create stdio transport for MCP communication
    const transport = new StdioServerTransport();

    // Create and start MCP handlers
    const handlers = new MCPHandlers(transport);

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Received SIGINT, shutting down gracefully...');
      await handlers.shutdown();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Received SIGTERM, shutting down gracefully...');
      await handlers.shutdown();
      process.exit(0);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

    logger.info('FFIEC UBPR MCP Server started successfully');
  } catch (error) {
    logger.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  logger.error('Fatal error:', error);
  process.exit(1);
}); 
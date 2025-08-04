import { FFIECService } from '../src/services/FFIECService';
import { FFIECCredentials, FFIECServiceConfig } from '../src/types/ffiec';

describe('FFIECService', () => {
  let ffiecService: FFIECService;
  let mockCredentials: FFIECCredentials;
  let mockConfig: FFIECServiceConfig;

  beforeEach(() => {
    mockCredentials = {
      username: 'test_user',
      password: 'test_password'
    };

    mockConfig = {
      url: 'https://cdr.ffiec.gov/public/pws/webservices/retrievalservice.asmx',
      timeout: 30000,
      retryAttempts: 3,
      rateLimit: {
        requestsPerMinute: 60,
        requestsPerHour: 1000
      }
    };

    ffiecService = new FFIECService(mockConfig, mockCredentials);
  });

  describe('initialization', () => {
    it('should create FFIECService instance', () => {
      expect(ffiecService).toBeInstanceOf(FFIECService);
    });

    it('should have correct initial connection status', () => {
      expect(ffiecService.getConnectionStatus()).toBe(false);
    });
  });

  describe('configuration', () => {
    it('should accept valid credentials and config', () => {
      expect(mockCredentials.username).toBe('test_user');
      expect(mockCredentials.password).toBe('test_password');
      expect(mockConfig.url).toContain('ffiec.gov');
    });
  });

  describe('error handling', () => {
    it('should handle missing client gracefully', async () => {
      const result = await ffiecService.testUserAccess();
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('AUTHENTICATION_ERROR');
    });
  });
}); 
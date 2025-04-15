import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { of } from 'rxjs'; // Required for mocking HttpService observables
import { FaqService, FaqItem } from './faq.service';
import { InternalServerErrorException } from '@nestjs/common';

// Mock data for Strapi response
const mockStrapiResponse = {
  data: {
    data: [
      {
        id: 1,
        attributes: {
          question: 'Test Question EN',
          answer: 'Test Answer EN',
          locale: 'en',
          documentId: 'doc1',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          publishedAt: '2023-01-01T00:00:00.000Z',
        },
      },
    ],
    meta: {
      pagination: {
        page: 1,
        pageSize: 25,
        pageCount: 1,
        total: 1,
      },
    },
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as any, // Cast to any to satisfy AxiosResponse structure
};

describe('FaqService', () => {
  let service: FaqService;
  let httpService: HttpService;
  let configService: ConfigService;
  let logger: Logger;

  // Create mock providers
  const mockHttpService = {
    get: jest.fn(), 
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'STRAPI_API_URL') return 'http://fake-strapi-url';
      if (key === 'STRAPI_API_TOKEN') return 'fake-api-token';
      return null;
    }),
  };

  // Use a simplified mock logger or Jest's mock functions
  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
    setContext: jest.fn(), // Add setContext if FaqService calls it
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FaqService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<FaqService>(FaqService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
    logger = module.get<Logger>(Logger); // Get logger instance if needed for assertions

    // Optional: Assign the logger context if FaqService does this in its constructor
    // service.logger.setContext('FaqService'); // Or whatever context it uses
    // mockLogger.setContext.mockClear(); // Clear mock if needed before tests
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- More test cases will be added below ---

  describe('findAll', () => {
    it('should call httpService with correct params for locale "en" and return mapped FAQs', async () => {
      // Arrange
      const locale = 'en';
      const mockEnResponse = {
        data: {
          data: [
            {
              id: 1,
              attributes: {
                question: 'Test Question EN',
                answer: 'Test Answer EN',
                locale: 'en',
                documentId: 'doc1',
                // ... other necessary fields
              },
            },
          ],
          meta: { pagination: { total: 1 } },
        },
        status: 200, statusText: 'OK', headers: {}, config: {} as any,
      };
      mockHttpService.get.mockReturnValueOnce(of(mockEnResponse)); // Use mockReturnValueOnce

      const expectedUrl = 'http://fake-strapi-url/api/faqs';
      const expectedParams = {
        locale: 'en',
        'fields[0]': 'question',
        'fields[1]': 'answer',
        'fields[2]': 'documentId',
        'pagination[pageSize]': 100,
      };
      const expectedHeaders = {
        headers: { Authorization: 'Bearer fake-api-token' },
        params: expectedParams,
      };

      const expectedResult: FaqItem[] = [
        {
          id: 'doc1', // Mapped from documentId
          question: 'Test Question EN',
          answer: 'Test Answer EN',
        },
      ];

      // Act
      const result = await service.findAll(locale);

      // Assert
      expect(mockHttpService.get).toHaveBeenCalledTimes(1);
      expect(mockHttpService.get).toHaveBeenCalledWith(expectedUrl, expectedHeaders);
      expect(result).toEqual(expectedResult);
      expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining(`[findAll] Starting to fetch FAQs for locale: ${locale}`));
      expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining(`[fetchFaqsFromStrapi] Fetching FAQs for locale: ${locale}`));
      expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining(`[findAll] Successfully fetched and mapped ${expectedResult.length} FAQs for locale ${locale}`));
      expect(mockLogger.error).not.toHaveBeenCalled(); // Ensure no errors were logged
    });

    // TODO: Add test for locale 'zh'
    it('should call httpService with correct params for locale "zh" and return mapped FAQs', async () => {
      // Arrange
      const locale = 'zh';
      const expectedUrl = 'http://fake-strapi-url/api/faqs';
       const mockStrapiZhResponse = {
         data: {
           data: [
             {
               id: 2,
               attributes: {
                 question: '测试问题 ZH',
                 answer: '测试答案 ZH',
                 locale: 'zh',
                 documentId: 'doc2',
                 // ... other fields
               },
             },
           ],
           meta: { pagination: { total: 1 } },
         },
          status: 200, statusText: 'OK', headers: {}, config: {} as any,
       };
        mockHttpService.get.mockReturnValueOnce(of(mockStrapiZhResponse)); // Use mockReturnValueOnce

      const expectedParams = {
        locale: 'zh',
        'fields[0]': 'question',
        'fields[1]': 'answer',
        'fields[2]': 'documentId',
        'pagination[pageSize]': 100,
      };
      const expectedHeaders = {
        headers: { Authorization: 'Bearer fake-api-token' },
        params: expectedParams,
      };
      const expectedResult: FaqItem[] = [
        {
          id: 'doc2',
          question: '测试问题 ZH',
          answer: '测试答案 ZH',
        },
      ];

      // Act
      const result = await service.findAll(locale);

      // Assert
      expect(mockHttpService.get).toHaveBeenCalledTimes(1);
      expect(mockHttpService.get).toHaveBeenCalledWith(expectedUrl, expectedHeaders);
      expect(result).toEqual(expectedResult);
      expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining(`locale: ${locale}`)); // Check locale in logs
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    // TODO: Add test for default locale (no argument)
    it('should default to locale "zh" when no locale is provided', async () => {
      // Arrange
      const defaultLocale = 'zh';
      const expectedUrl = 'http://fake-strapi-url/api/faqs';
       const mockStrapiZhResponse = {
         data: {
           data: [
             {
               id: 3,
               attributes: {
                 question: '默认问题 ZH',
                 answer: '默认答案 ZH',
                 locale: 'zh',
                 documentId: 'doc3',
                 // ... other fields
               },
             },
           ],
            meta: { pagination: { total: 1 } },
         },
          status: 200, statusText: 'OK', headers: {}, config: {} as any,
       };
        mockHttpService.get.mockReturnValueOnce(of(mockStrapiZhResponse)); // Use mockReturnValueOnce

      const expectedParams = {
        locale: defaultLocale,
        'fields[0]': 'question',
        'fields[1]': 'answer',
        'fields[2]': 'documentId',
        'pagination[pageSize]': 100,
      };
      const expectedHeaders = {
        headers: { Authorization: 'Bearer fake-api-token' },
        params: expectedParams,
      };
       const expectedResult: FaqItem[] = [
        {
          id: 'doc3',
          question: '默认问题 ZH',
          answer: '默认答案 ZH',
        },
      ];

      // Act
      const result = await service.findAll(); // Call without locale

      // Assert
      expect(mockHttpService.get).toHaveBeenCalledTimes(1);
      expect(mockHttpService.get).toHaveBeenCalledWith(expectedUrl, expectedHeaders); // Verify default locale 'zh' was used in params
      expect(result).toEqual(expectedResult);
      expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining(`locale: ${defaultLocale}`)); // Check default locale in logs
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should return an empty array when Strapi returns no data (empty array)', async () => {
      // Arrange
      const locale = 'en';
      const mockEmptyResponse = {
        data: {
          data: [], // Simulate empty data array
          meta: { pagination: { total: 0 } },
        },
        status: 200, statusText: 'OK', headers: {}, config: {} as any,
      };
      mockHttpService.get.mockReturnValueOnce(of(mockEmptyResponse)); // Use mockReturnValueOnce

      // Act
      const result = await service.findAll(locale);

      // Assert
      expect(result).toEqual([]);
      expect(mockHttpService.get).toHaveBeenCalledTimes(1); // Ensure HTTP call was made
      expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining(`[findAll] Successfully fetched and mapped 0 FAQs for locale ${locale}`));
      expect(mockLogger.warn).not.toHaveBeenCalled(); 
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should return an empty array when Strapi returns no data (null data field)', async () => {
      // Arrange
      const locale = 'zh';
      const mockNullDataResponse = {
        data: {
          data: null, // Simulate null data field (possible Strapi behavior)
          meta: { pagination: { total: 0 } },
        },
        status: 200, statusText: 'OK', headers: {}, config: {} as any,
      };
       // Important: Need to check if FaqService handles { data: { data: null } } or just { data: null }
       // Based on current FaqService code, it checks !response.data.data
      mockHttpService.get.mockReturnValueOnce(of(mockNullDataResponse)); // Use mockReturnValueOnce

      // Act
      const result = await service.findAll(locale);

      // Assert
      expect(result).toEqual([]);
      expect(mockHttpService.get).toHaveBeenCalledTimes(1);
       expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining(`No FAQ data found in response for locale ${locale}`));
      expect(mockLogger.warn).not.toHaveBeenCalled();
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should log an error and throw InternalServerErrorException when httpService throws an error', async () => {
      // Arrange
      const locale = 'en';
      const errorMessage = 'Network Error';
      const { throwError } = require('rxjs');
      mockHttpService.get.mockReturnValueOnce(throwError(() => new Error(errorMessage))); // Use mockReturnValueOnce

      // Act & Assert
      await expect(service.findAll(locale)).rejects.toThrow(InternalServerErrorException);

      // Verify logging
      expect(mockLogger.error).toHaveBeenCalledTimes(2); 
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining(`[findAll] Error fetching FAQs for locale ${locale}: ${errorMessage}`),
        expect.any(Error) // Expect an actual Error object now
      );
       expect(mockLogger.error).toHaveBeenNthCalledWith(1, 
         expect.stringContaining(`[fetchFaqsFromStrapi] Failed to fetch FAQs for locale ${locale}`),
         expect.any(Error) 
       );
      expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining(`[findAll] Starting to fetch FAQs for locale: ${locale}`)); // Initial log should still happen
    });

    it('should log a warning and return null from fetchFaqsFromStrapi if Strapi returns 404, leading to empty array from findAll', async () => {
      // Arrange
      const locale = 'zh';
      const errorResponse = {
        response: {
          status: 404,
          data: { message: 'Not Found' }, // Example 404 response
        },
        message: 'Request failed with status code 404',
        isAxiosError: true, // Important for NestJS HttpService error handling
         // Add other AxiosError properties if needed by the service logic
         config: {}, name: 'AxiosError', code: 'ERR_BAD_REQUEST'
      };

      const { throwError } = require('rxjs');
      // Simulate HttpService throwing an AxiosError with 404 status
      mockHttpService.get.mockReturnValueOnce(throwError(() => errorResponse)); // Use mockReturnValueOnce

      // Act
      const result = await service.findAll(locale);

      // Assert
      // Based on current FaqService, fetchFaqsFromStrapi catches 404 and returns null,
      // which findAll then treats as empty data.
      expect(result).toEqual([]);
      expect(mockHttpService.get).toHaveBeenCalledTimes(1);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining(`[fetchFaqsFromStrapi] Strapi returned 404 for locale ${locale}`));
      expect(mockLogger.error).toHaveBeenCalledTimes(1); 
      expect(mockLogger.error).toHaveBeenCalledWith(
         expect.stringContaining(`[fetchFaqsFromStrapi] Failed to fetch FAQs for locale ${locale}. Status: 404`),
         errorResponse // Expect the exact simulated error object 
      ); 
    });

  });

}); 
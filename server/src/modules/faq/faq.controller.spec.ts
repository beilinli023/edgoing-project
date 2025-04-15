import { Test, TestingModule } from '@nestjs/testing';
import { FaqController } from './faq.controller';
import { FaqService, FaqItem } from './faq.service'; // Import FaqItem if used in controller tests
import { Logger, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { Locale } from './faq.controller'; // Corrected import from controller file

// Mock data for FaqService response
const mockFaqItems: FaqItem[] = [
  { id: 'doc1', question: 'Test Question 1', answer: 'Test Answer 1' },
  { id: 'doc2', question: 'Test Question 2', answer: 'Test Answer 2' },
];

describe('FaqController', () => {
  let controller: FaqController;
  let faqService: FaqService;
  let logger: Logger;

  // Create mock service and logger
  const mockFaqService = {
    findAll: jest.fn().mockResolvedValue(mockFaqItems), // Mock findAll to return resolved value
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FaqController],
      providers: [
        { provide: FaqService, useValue: mockFaqService },
        { provide: Logger, useValue: mockLogger }, // Provide mock logger
      ],
    }).compile();

    controller = module.get<FaqController>(FaqController);
    faqService = module.get<FaqService>(FaqService); // Get mock service instance
    logger = module.get<Logger>(Logger); // Get mock logger instance

    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- More test cases will be added below ---
  describe('findAll', () => {
    it('should call faqService.findAll with the correct locale and return its result', async () => {
      // Arrange
      const locale = Locale.EN;
      // mockFaqService.findAll is already set up in beforeEach to resolve with mockFaqItems

      // Act
      const result = await controller.findAll(locale);

      // Assert
      expect(mockFaqService.findAll).toHaveBeenCalledTimes(1);
      expect(mockFaqService.findAll).toHaveBeenCalledWith(locale);
      expect(result).toEqual(mockFaqItems);
      expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining(`Received request for FAQs. Locale: ${locale}`));
      expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining(`Successfully fetched ${mockFaqItems.length} FAQs for locale ${locale}`));
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should handle locale ZH correctly', async () => {
      // Arrange
      const locale = Locale.ZH;
      const mockZhItems = [{ id: 'doc3', question: 'ZH Q', answer: 'ZH A' }];
      mockFaqService.findAll.mockResolvedValueOnce(mockZhItems);

      // Act
      const result = await controller.findAll(locale);

      // Assert
      expect(mockFaqService.findAll).toHaveBeenCalledTimes(1);
      expect(mockFaqService.findAll).toHaveBeenCalledWith(locale);
      expect(result).toEqual(mockZhItems);
      expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining(`Locale: ${locale}`));
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    // Note: Testing the DefaultValuePipe and ParseEnumPipe functionality directly 
    // is more involved and often considered part of E2E or integration testing.
    // For unit tests, we assume the pipes work and test the controller logic 
    // with the expected outcome of the pipes (i.e., receiving a valid Locale enum value).
    // If we wanted to test the pipes themselves, we'd need a different setup.

    it('should log and throw HttpException when service throws an error', async () => {
      // Arrange
      const locale = Locale.EN;
      const serviceError = new InternalServerErrorException('Service failed');
      mockFaqService.findAll.mockRejectedValueOnce(serviceError);

      // Act & Assert
      await expect(controller.findAll(locale)).rejects.toThrow(HttpException);
      // Verify specific HttpException properties if needed
      // await expect(controller.findAll(locale)).rejects.toMatchObject({
      //   status: HttpStatus.INTERNAL_SERVER_ERROR,
      //   message: 'Failed to retrieve FAQs',
      // });

      // Verify logging
      expect(mockLogger.error).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining(`Error in controller while fetching FAQs for locale ${locale}: ${serviceError.message}`),
        serviceError.stack // Controller logs the stack
      );
      expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining(`Received request for FAQs. Locale: ${locale}`)); // Initial log should still happen
    });

     it('should log and re-throw HttpException if service throws HttpException', async () => {
       // Arrange
       const locale = Locale.ZH;
       const serviceHttpError = new HttpException('Specific Service Error', HttpStatus.BAD_REQUEST);
       // Set the mock to reject just for this test case
       mockFaqService.findAll.mockRejectedValueOnce(serviceHttpError); 

       // Act & Assert
       try {
         await controller.findAll(locale);
         // If it reaches here, the test fails because it didn't throw
         fail('Expected controller.findAll to throw HttpException, but it did not.'); 
       } catch (error) {
         // Assert that the caught error is the expected HttpException
         expect(error).toBeInstanceOf(HttpException);
         expect(error).toEqual(serviceHttpError); // Should re-throw the original HttpException
       }
       
       // Verify logging (check after the catch block)
       expect(mockLogger.error).toHaveBeenCalledTimes(1);
       expect(mockLogger.error).toHaveBeenCalledWith(
         expect.stringContaining(`Error in controller while fetching FAQs for locale ${locale}: ${serviceHttpError.message}`),
         serviceHttpError.stack 
       );
       // Ensure the initial log still happened before the error
       expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining(`Received request for FAQs. Locale: ${locale}`));
     });

  });

}); 
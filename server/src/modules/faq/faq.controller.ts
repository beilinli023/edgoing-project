import { Controller, Get, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { FaqService } from './faq.service';

@Controller('faqs')
export class FaqController {
  private readonly logger = new Logger(FaqController.name);

  constructor(private readonly faqService: FaqService) {}

  @Get('test')
  testFaqRoute(): string {
    this.logger.log('[testFaqRoute] Test FAQ route accessed!');
    return 'FAQ test route works!';
  }

  @Get()
  async findAll() {
    this.logger.log(`[findAll] Received request for all merged FAQs.`);
    try {
      const faqs = await this.faqService.findAll();
      this.logger.log(`[findAll] Successfully fetched and merged ${faqs.length} FAQs.`);
      return faqs;
    } catch (error) {
      this.logger.error(`[findAll] Error in controller while fetching merged FAQs: ${error.message}`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Failed to retrieve FAQs', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  // Optional: Add endpoint for single FAQ? (Would need different logic)
  // @Get(':id')
  // async findOne(@Param('id', ParseIntPipe) id: number) { ... }

  // Optional: Endpoint for search? (Could be added here)
  // @Get('search')
  // async searchFaqs(@Query('q') query: string) { ... }
} 
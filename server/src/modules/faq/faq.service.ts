import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

// 定义 Strapi 返回的单个 FAQ 条目结构 (基于 curl 结果)
interface StrapiFaqItem {
  id: number;
  documentId: string;
  question: string;
  answer: string;
}

// 定义 Strapi API 响应结构
interface StrapiResponse<T> {
  data: T[];
  meta: any; // 暂时忽略 meta
}

// 定义前端期望的 FAQ 结构 (简化版，暂时不含 Category)
interface FrontendFaqItem {
  id: string; // 使用 documentId 作为唯一标识
  question_en: string;
  question_zh: string;
  answer_en: string;
  answer_zh: string;
  // 稍后添加 category 和 order 等
}

@Injectable()
export class FaqService {
  private readonly logger = new Logger(FaqService.name);
  private strapiUrl: string;
  private strapiToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.strapiUrl = this.configService.get<string>('STRAPI_API_URL')||''.replace(/\/$/, '');
    this.strapiToken = this.configService.get<string>('STRAPI_API_TOKEN')||'';

    if (!this.strapiUrl || !this.strapiToken) {
      this.logger.error('Strapi URL or Token not configured!');
      throw new InternalServerErrorException('Strapi configuration is missing');
    }
    this.logger.log('FaqService initialized');
  }

  /**
   * 获取所有 FAQ，并合并中英文版本，返回前端期望的格式
   */
  async findAll(): Promise<FrontendFaqItem[]> {
    this.logger.log('[findAll] Starting to fetch and merge FAQs from Strapi.');
    try {
      // 1. 并行获取英文和中文数据
      const [enResponse, zhResponse] = await Promise.all([
        this.fetchFaqsFromStrapi('en'),
        this.fetchFaqsFromStrapi('zh'),
      ]);

      this.logger.debug(`[findAll] Received EN data count: ${enResponse?.data?.length ?? 0}`);
      this.logger.debug(`[findAll] Received ZH data count: ${zhResponse?.data?.length ?? 0}`);

      // 2. 合并数据
      const mergedFaqs = this.mergeFaqData(enResponse?.data, zhResponse?.data);
      this.logger.log(`[findAll] Successfully merged ${mergedFaqs.length} FAQs.`);

      return mergedFaqs;

    } catch (error) {
      this.logger.error(`[findAll] Error fetching or merging FAQs: ${error.message}`, error.stack);
      // 可以选择返回空数组或重新抛出错误
      // return [];
      throw new InternalServerErrorException('Failed to get FAQs from Strapi');
    }
  }

  /**
   * 从 Strapi 获取指定语言的 FAQ 列表
   * @param locale 'en' or 'zh'
   */
  private async fetchFaqsFromStrapi(locale: 'en' | 'zh'): Promise<StrapiResponse<StrapiFaqItem> | null> {
    const fields = ['question', 'answer', 'documentId']; // 添加 documentId
    const url = `${this.strapiUrl}/api/faqs`;
    const params = {
      locale,
      fields, // Strapi v4 支持直接传递数组
      // sort: 'order:asc', // 暂时移除排序，因为字段不存在
      pagination: { pageSize: 100 }, // 获取足够多的数据
    };

    this.logger.log(`[fetchFaqsFromStrapi] Fetching FAQs for locale: ${locale}. URL: ${url} with params: ${JSON.stringify(params)}`);

    try {
      const response = await firstValueFrom(
        this.httpService.get<StrapiResponse<StrapiFaqItem>>(url, {
          headers: { Authorization: `Bearer ${this.strapiToken}` },
          params: {
            locale: params.locale,
            fields: params.fields,
            'pagination[pageSize]': params.pagination.pageSize,
            // 'sort': params.sort, // 保持注释
          }
        })
      );
      this.logger.debug(`[fetchFaqsFromStrapi] Raw response for ${locale}: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      this.logger.error(`[fetchFaqsFromStrapi] Failed to fetch FAQs for locale ${locale}. Status: ${status}. Error: ${error.message}`, error.stack);
       if (status === 404) {
          this.logger.warn(`[fetchFaqsFromStrapi] Strapi returned 404 for locale ${locale}, assuming no data.`);
          return null; // 404 视为无数据
       }
      // 其他错误向上抛出
      throw error; // 让调用者处理
    }
  }

  /**
   * 合并英文和中文 FAQ 数据
   * @param enData 英文数据数组
   * @param zhData 中文数据数组
   */
  private mergeFaqData(enData?: StrapiFaqItem[], zhData?: StrapiFaqItem[]): FrontendFaqItem[] {
    const faqMap = new Map<string, Partial<FrontendFaqItem>>();
    const safeEnData = Array.isArray(enData) ? enData : [];
    const safeZhData = Array.isArray(zhData) ? zhData : [];

    // 处理英文数据
    safeEnData.forEach(item => {
      if (!item.documentId) {
        this.logger.warn(`[mergeFaqData] Skipping EN item with missing documentId: ${item.id}`);
        return;
      }
      if (!faqMap.has(item.documentId)) {
        faqMap.set(item.documentId, { id: item.documentId });
      }
      const existing = faqMap.get(item.documentId)!;
      existing.question_en = item.question;
      existing.answer_en = item.answer;
    });

    // 处理中文数据
    safeZhData.forEach(item => {
      if (!item.documentId) {
        this.logger.warn(`[mergeFaqData] Skipping ZH item with missing documentId: ${item.id}`);
        return;
      }
      if (!faqMap.has(item.documentId)) {
        faqMap.set(item.documentId, { id: item.documentId });
      }
      const existing = faqMap.get(item.documentId)!;
      existing.question_zh = item.question;
      existing.answer_zh = item.answer;
    });

    // 转换 Map 为数组，并填充缺失的语言版本
    const result: FrontendFaqItem[] = [];
    faqMap.forEach(value => {
      result.push({
        id: value.id!,
        question_en: value.question_en || value.question_zh || '', // 用中文填充缺失的英文
        question_zh: value.question_zh || value.question_en || '', // 用英文填充缺失的中文
        answer_en: value.answer_en || value.answer_zh || '',     // 同上
        answer_zh: value.answer_zh || value.answer_en || '',     // 同上
      });
    });

    this.logger.debug(`[mergeFaqData] Final merged data structure (first item): ${JSON.stringify(result[0])}`);
    return result;
  }

  // TODO: 实现 searchFaqs 方法
  // TODO: 添加处理 Category 和 Order 的逻辑 (需要在 Strapi 中添加字段)
} 
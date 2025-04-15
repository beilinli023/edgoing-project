import { Controller, Get, Injectable, InternalServerErrorException, Logger, Query, Param, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { BlogService, AuthorData, ProgramTypeData, GradeData, BlogDetail } from './blog.service';

// 定义博客数据接口
interface BlogPost {
  id: string | number;
  title: string;
  content: string;
  image: string | null;
  date: string;
  documentId: string;
  slideshow: Array<{ url: string }>;
  grade: {
    id: string | number;
    name: string;
    description: string;
  } | null;
  programType: {
    id: string | number;
    name: string;
    description: string;
  } | null;
}

// 定义Strapi响应结构接口
interface StrapiData {
  id: string | number;
  documentId?: string;
  title?: string;
  content?: any;
  Date?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  slug?: string;
  grade?: {
    id: number | string;
    documentId?: string;
    grade?: string;
    name?: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    locale?: string;
  };
  program_type?: {
    id: number | string;
    documentId?: string;
    programname?: string;
    name?: string;
    type?: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    locale?: string;
  };
  image?: {
    id: number | string;
    name?: string;
    url?: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
    };
  };
  Slideshow?: Array<{
    id: number | string;
    name?: string;
    url?: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
    };
  }>;
  localizations?: Array<StrapiData>;
}

// 定义富文本基本结构
interface RichTextBlockChild {
  type: string;
  text?: string;
  // 可以根据需要添加其他属性，如 bold, italic 等
}

interface RichTextBlock {
  type: string;
  children?: RichTextBlockChild[];
  // 可以根据需要添加其他属性，如 level (for headings), format (for lists)
}

// 定义 testStrapiConnection 返回类型
interface StrapiTestResponse {
  status: number;
  data?: {
    count: number;
  };
  url: string;
  articleAnalysis?: Record<string, unknown>; // Use unknown instead of any
  apiResponse?: unknown; // Use unknown instead of any
  error?: string;
}

// 定义 getRawStrapiData 返回类型
type RawStrapiDataResponse = Record<string, unknown>; // Use unknown instead of any

// 定义博客列表响应接口
interface BlogListResponse {
  posts: BlogPost[];
  totalPages: number;
  totalPosts: number;
}

// --- Define Frontend API Response Structure --- 

// Re-define BlogPost for the API response structure sent TO frontend
interface BlogApiResponseItem {
  id: string | number;
  title: string;
  content?: string; // Content might be truncated or omitted in list view
  excerpt?: string; // Add excerpt
  image: string | null; // Cover image URL
  date: string; // Publication date
  documentId?: string;
  slug?: string; // Add slug
  slideshow?: Array<{ url: string }>; // Slideshow URLs
  grade?: { // Keep simplified structure for frontend
    id: string | number;
    name: string; 
  } | null;
  programType?: { // Keep simplified structure for frontend, use programType
    id: string | number;
    name: string; 
  } | null;
  authorName?: string | null; // Add author name
}

// Define StrapiData based on what the controller actually receives and uses
interface ReceivedStrapiData {
  id: number;
  attributes: {
    documentId?: string;
    title?: string;
    content?: any;
    Date?: string; 
    publishedAt?: string; 
    locale?: string;
    slug?: string;
    author?: string | null | undefined;
    grade?: { data?: { id: number; attributes?: { grade?: string } } }; // Nested grade
    program_type?: { data?: { id: number; attributes?: { programname?: string } } }; // Nested program_type
    image?: { 
        data?: { 
            id: number; 
            attributes?: { 
                url?: string; 
                formats?: { [key: string]: { url: string } }; 
            }; 
        }; 
        url?: string; 
    }; 
    Slideshow?: { 
        data?: Array<{ id: number; attributes?: { url?: string; formats?: { [key: string]: { url: string } } } }>;
        items?: Array<any>; // Keep flexible for now
    };
    [key: string]: any; // Allow other attributes
  };
}

// Define blog list response for frontend
interface BlogListApiResponse {
  posts: BlogApiResponseItem[];
  totalPages: number;
  totalPosts: number;
}

@Injectable()
@Controller('blog')
export class BlogController {
  private readonly logger = new Logger(BlogController.name);
  private readonly strapiUrl: string;
  private readonly strapiToken: string;

  constructor(
    private readonly blogService: BlogService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.strapiUrl = this.configService.get<string>('STRAPI_API_URL') || 'http://localhost:1337';
    this.strapiToken = this.configService.get<string>('STRAPI_API_TOKEN') || '';
    this.logger.log(`【博客控制器】已初始化 Strapi URL=${this.strapiUrl}`);
  }

  /**
   * 简单的ping测试端点
   */
  @Get('ping')
  ping() {
    return { message: 'pong', timestamp: new Date().toISOString() };
  }

  /**
   * Endpoint to get a list of blog posts (proxied and formatted)
   */
  @Get()
  async getAllBlogs(
    @Query('locale', new DefaultValuePipe('zh')) locale: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number,
  ): Promise<BlogListApiResponse> {
    this.logger.log(`【请求处理 /blog】Locale=${locale}, Page=${page}, Limit=${limit}`);
    try {
      // Call the new service method to fetch data from Strapi
      const { data: strapiBlogs, pagination } = await this.blogService.fetchSingleLocaleBlogList({
        locale,
        page,
        limit,
      });

      const totalPages = pagination?.pageCount || 1;
      const totalPosts = pagination?.total || strapiBlogs.length;

      this.logger.log(`【getAllBlogs】Service returned ${strapiBlogs.length} blogs. Total Pages: ${totalPages}, Total Posts: ${totalPosts}`);

      // Map the raw Strapi data to the frontend format
      const mappedPosts = strapiBlogs.map(blog => 
          this.mapStrapiToFrontendListFormat(blog)
      );

      this.logger.log(`【getAllBlogs】成功映射 ${mappedPosts.length} 篇博客`);
      const responsePayload: BlogListApiResponse = { posts: mappedPosts, totalPages, totalPosts };
      this.logger.log(`【getAllBlogs】准备返回给前端的数据: ${JSON.stringify({ totalPages, totalPosts, postsCount: responsePayload.posts.length })}`); 
      
      return responsePayload;

    } catch (error) {
      // Log error (Service should ideally handle specific Strapi errors, 
      // but controller can catch broader errors or re-thrown exceptions)
      this.logger.error('【getAllBlogs】处理博客列表请求失败:', error.stack || error.message);
      // Return empty list in case of any error during service call or mapping
      return { posts: [], totalPages: 0, totalPosts: 0 }; 
    }
  }

  /**
   * Maps raw Strapi data (single item, potentially flattened structure) to the frontend list format (BlogApiResponseItem)
   */
  private mapStrapiToFrontendListFormat(strapiItem: any): BlogApiResponseItem { // Use 'any' temporarily or define a FlatStrapiItem interface
    // Remove the assumption of an 'attributes' layer based on observed logs
    this.logger.debug(`【mapStrapiToFrontendListFormat】开始映射 Blog ID: ${strapiItem?.id}. Received item: ${JSON.stringify(strapiItem, null, 2)}`);
    // const attr = strapiItem.attributes || {}; // REMOVE THIS LINE

    const id = strapiItem?.id;
    // Access fields directly from strapiItem
    const title = strapiItem?.title || 'No Title';
    const documentId = strapiItem?.documentId;
    const slug = strapiItem?.slug;
    const date = strapiItem?.publishedAt || strapiItem?.Date || new Date().toISOString();
    const content = strapiItem?.content;
    const authorName = strapiItem?.author || null;
    
    this.logger.debug(`【mapStrapiToFrontendListFormat】ID ${id}: Author Name = ${authorName} (Accessed via strapiItem.author)`);

    // Access relations directly from strapiItem
    const gradeData = strapiItem?.grade; // The whole grade object
    const gradeName = gradeData?.grade || null; 
    const gradeId = gradeData?.id || null;
    this.logger.debug(`【mapStrapiToFrontendListFormat】ID ${id}: Grade ID = ${gradeId}, Name = ${gradeName} (Accessed via strapiItem.grade?.grade)`);

    const programTypeData = strapiItem?.program_type; // The whole program_type object
    const programTypeName = programTypeData?.programname || null;
    const programTypeId = programTypeData?.id || null;
    this.logger.debug(`【mapStrapiToFrontendListFormat】ID ${id}: ProgramType ID = ${programTypeId}, Name = ${programTypeName} (Accessed via strapiItem.program_type?.programname)`);
    
    // Pass the potentially flat image/slideshow data to extractors
    const imageUrl = this.extractImageUrlFromStrapi(strapiItem?.image); 
    this.logger.debug(`【mapStrapiToFrontendListFormat】ID ${id}: Image URL = ${imageUrl}`);

    const slideshowUrls = this.extractSlideshowUrlsFromStrapi(strapiItem?.Slideshow);
    this.logger.debug(`【mapStrapiToFrontendListFormat】ID ${id}: Slideshow URLs Count = ${slideshowUrls.length}`);

    const excerpt = this.extractTextFromRichText(content, 100);
    this.logger.debug(`【mapStrapiToFrontendListFormat】ID ${id}: Excerpt = ${excerpt}`);

    const mappedItem: BlogApiResponseItem = {
        id: id || 0, // Provide default if id is somehow missing
        title: title,
        excerpt: excerpt,
        image: imageUrl,
        date: date,
        documentId: documentId,
        slug: slug,
        slideshow: slideshowUrls.map(url => ({ url })), 
        grade: gradeId && gradeName ? { id: gradeId, name: gradeName } : null,
        programType: programTypeId && programTypeName ? { id: programTypeId, name: programTypeName } : null,
        authorName: authorName,
    };

    this.logger.log(`【mapStrapiToFrontendListFormat】完成映射 Blog ID: ${id}, Title: ${title}`);
    return mappedItem;
  }
  
  /**
   * Extracts Image URL from Strapi data
   * Check data.attributes first, then direct url
   */
  private extractImageUrlFromStrapi(imageData?: any): string | null {
      if (!imageData) return null;
      // Check standard structure first
      if (imageData.data?.attributes?.url) {
          return this.ensureFullUrl(imageData.data.attributes.url);
      }
      // Fallback to direct URL
      if (imageData.url) {
          return this.ensureFullUrl(imageData.url);
      } 
      // Add check for small format if needed? 
      // else if (imageData.data?.attributes?.formats?.small?.url) { ... }
      this.logger.warn(`【extractImageUrlFromStrapi】Could not extract URL from: ${JSON.stringify(imageData)}`);
      return null;
  }

  /**
   * Extracts Slideshow URLs from Strapi data
   * Check data array first, then direct array
   */
  private extractSlideshowUrlsFromStrapi(slideshowData?: any): string[] {
      // Check standard structure first (array within data)
      if (slideshowData?.data && Array.isArray(slideshowData.data)) {
          return slideshowData.data
              .map((item: any) => item.attributes?.url)
              .filter((url?: string): url is string => !!url)
              .map((url: string) => this.ensureFullUrl(url));
      }
      // Fallback to direct array of items (potentially with direct url)
      if (Array.isArray(slideshowData)) {
           return slideshowData
              .map((item: any) => {
                  if (item?.attributes?.url) return item.attributes.url; // Handle if items have attributes
                  if (item?.url) return item.url; // Handle if items have direct url
                  return null;
              })
              .filter((url?: string | null): url is string => !!url)
              .map((url: string) => this.ensureFullUrl(url));
      }
      this.logger.warn(`【extractSlideshowUrlsFromStrapi】Could not extract URLs from: ${JSON.stringify(slideshowData)}`);
      return [];
  }
  
  /**
   * Ensures URL is absolute (mirrors BlogService logic)
   */
  private ensureFullUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const baseUrl = this.strapiUrl.replace(/\/api$/, ''); 
    return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
  }

  /**
   * Extracts plain text from Strapi's rich text format (simplified version)
   */
  private extractTextFromRichText(content: any, maxLength?: number): string {
    let text = '';
    if (Array.isArray(content)) {
      for (const block of content) {
        if (block.type === 'paragraph' && Array.isArray(block.children)) {
          for (const child of block.children) {
            if (child.type === 'text' && child.text) {
              text += child.text + ' ';
            }
          }
        }
      }
    }
    text = text.trim();
    if (maxLength && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  @Get('test-strapi')
  async testStrapiConnection(
    @Query('locale') locale?: string,
    @Query('limit') limit?: string,
    @Query('fields') fields?: string,
    @Query('populate') populate?: string,
  ): Promise<StrapiTestResponse> {
    this.logger.log(`执行Strapi连接测试, 参数: locale=${locale}, limit=${limit}, fields=${fields}, populate=${populate}`);
    
    let url = `${this.blogService.getStrapiUrl()}/api/blogposts?populate=*`;
    if (locale) {
      url += `&locale=${locale}`;
    }
    if (limit) {
      url += `&pagination[limit]=${limit}`;
    }
    
    this.logger.log(`Strapi请求URL: ${url}`);
    
    try {
      const apiResponse = await this.blogService.fetchStrapiApi(url);
      
      const response: Partial<StrapiTestResponse> = {
        status: 200,
        data: {
          count: Array.isArray(apiResponse.data) ? apiResponse.data.length : (apiResponse.data ? 1 : 0)
        },
        url: url,
      };
      
      if (apiResponse.data && Array.isArray(apiResponse.data) && apiResponse.data.length > 0) {
        const firstArticle = apiResponse.data[0];
        response.articleAnalysis = {
          id: firstArticle.id,
          attributesKeys: Object.keys(firstArticle.attributes || {}),
        };
        
        if (firstArticle.attributes?.grade) {
          const gradeAttr = firstArticle.attributes.grade as { data?: { attributes?: Record<string, unknown> } } | null;
          response.articleAnalysis.grade = {
            structure: typeof firstArticle.attributes.grade,
            hasData: gradeAttr?.data !== null && gradeAttr?.data !== undefined,
            dataKeys: gradeAttr?.data ? Object.keys(gradeAttr.data) : [],
            attributesKeys: gradeAttr?.data?.attributes ? Object.keys(gradeAttr.data.attributes) : []
          };
        }
        
        if (firstArticle.attributes?.program_type) {
          const programTypeAttr = firstArticle.attributes.program_type as { data?: { attributes?: Record<string, unknown> } } | null;
          response.articleAnalysis.program_type = {
            structure: typeof firstArticle.attributes.program_type,
            hasData: programTypeAttr?.data !== null && programTypeAttr?.data !== undefined,
            dataKeys: programTypeAttr?.data ? Object.keys(programTypeAttr.data) : [],
            attributesKeys: programTypeAttr?.data?.attributes ? Object.keys(programTypeAttr.data.attributes) : []
          };
        }
        
        if (limit === '1') {
          response.apiResponse = apiResponse;
        }
      }
      
      return response as StrapiTestResponse;
    } catch (error) {
      this.logger.error(`Strapi连接测试失败: ${error.message}`);
      return {
        status: 500,
        error: error.message,
        url: url
      };
    }
  }
  
  @Get('raw-strapi')
  async getRawStrapiResponse(
    @Query('locale') locale?: string,
    @Query('fields') fields?: string,
    @Query('populate') populate?: string,
  ): Promise<{ status: number; url: string; data?: unknown; error?: string }> {
    this.logger.log(`获取原始Strapi响应，参数: locale=${locale}, fields=${fields}, populate=${populate}`);
    
    let url = `${this.blogService.getStrapiUrl()}/api/blogposts?`;
    url += `populate=${populate || '*'}`;
    if (locale) url += `&locale=${locale}`;
    if (fields) url += `&fields=${fields}`;
    
    this.logger.log(`原始Strapi请求URL: ${url}`);
    
    try {
      const apiResponse = await this.blogService.fetchStrapiApi(url);
      return {
        status: 200,
        url: url,
        data: apiResponse
      };
    } catch (error) {
      this.logger.error(`获取原始Strapi响应失败: ${error.message}`);
      return {
        status: 500,
        error: error.message,
        url: url
      };
    }
  }

  @Get('raw-strapi-data')
  async getRawStrapiData(
    @Query('locale') locale: string = 'zh',
    @Query('populate') populate: string = '*',
    @Query('fields') fields: string = '',
    @Query('limit') limit: string = '1',
  ): Promise<RawStrapiDataResponse> {
    this.logger.log(`获取原始Strapi数据，locale=${locale}, populate=${populate}, fields=${fields}, limit=${limit}`);
    
    try {
      let url = `${this.strapiUrl}/blogposts?populate=${populate}&locale=${locale}&pagination[pageSize]=${limit}`;
      if (fields) {
        url += `&fields=${fields}`;
      }
      this.logger.log(`请求URL: ${url}`);
      
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${this.strapiToken}`
          }
        })
      );

      if (!response || !response.data) {
        throw new Error('Strapi API返回空响应');
      }
      
      this.logger.log(`Strapi API响应成功，状态码: ${response.status}`);
      
      return {
        status: response.status,
        rawData: response.data,
        dataStructure: {
          dataIsArray: Array.isArray(response.data.data),
          count: Array.isArray(response.data.data) ? response.data.data.length : 0,
          topLevelKeys: Object.keys(response.data),
          hasMeta: !!response.data.meta,
          metaKeys: response.data.meta ? Object.keys(response.data.meta) : []
        },
        url
      };
    } catch (error) {
      this.logger.error(`获取原始Strapi数据失败: ${error.message}`);
      if (error.response) {
        this.logger.error(`响应状态: ${error.response.status}`);
        this.logger.error(`响应数据: ${JSON.stringify(error.response.data)}`);
      }
      
      return {
        status: error.response?.status || 500,
        error: error.message,
        url: `${this.strapiUrl}/blogposts?populate=${populate}&locale=${locale}&pagination[pageSize]=${limit}`
      };
    }
  }

  /**
   * Endpoint to get a single blog post detail by slug
   */
  @Get(':slug')
  async getBlogBySlug(
    @Param('slug') slug: string,
  ): Promise<BlogDetail> {
    this.logger.log(`【请求处理 /blog/:slug】请求的 slug=${slug}`);
    try {
      const blogDetail = await this.blogService.findOneBySlug(slug);
      this.logger.log(`【getBlogBySlug】成功获取 slug=${slug} 的详情`);
      return blogDetail;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`【getBlogBySlug】未找到 slug=${slug} 的博客: ${error.message}`);
        throw error; 
      } else {
        this.logger.error(`【getBlogBySlug】处理 slug=${slug} 请求失败:`, error.stack || error.message);
        throw new InternalServerErrorException(`获取 slug=${slug} 的博客详情时发生错误`);
      }
    }
  }
}


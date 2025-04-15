import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';

// 定义 Strapi 响应数据的基本结构
interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface StrapiMeta {
  pagination?: StrapiPagination;
}

interface StrapiDataItem<TAttributes> {
  id: number;
  attributes: TAttributes;
}

interface StrapiResponseData<TAttributes> {
  data: StrapiDataItem<TAttributes>[] | StrapiDataItem<TAttributes> | null;
  meta?: StrapiMeta;
}

// 定义图片数据结构
interface ImageData {
  data?: {
    id: number;
    attributes?: {
      url: string;
      formats?: { // 添加 formats 以便 ensureFullUrl 可以使用
        [key: string]: { url: string };
      };
      [key: string]: any; // 保持灵活性
    };
  };
  url?: string; // 支持直接 url 属性
}

// 定义幻灯片数据结构
interface SlideshowData {
  data?: Array<{
    id: number;
    attributes?: {
      url: string;
      formats?: { 
        [key: string]: { url: string };
      };
      [key: string]: any; 
    };
  }>;
  // 支持直接的图片对象数组
  items?: Array<ImageData>; 
}

// 定义年级数据结构
export interface GradeData {
  id: number;
  documentId?: string;
  grade: string;
  name?: string;
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

// 定义项目类型数据结构
export interface ProgramTypeData {
  id: number;
  documentId?: string;
  programname: string;
  name?: string;
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

// 添加 Author 数据结构 (假设结构)
export interface AuthorData {
  id: number;
  attributes: {
    name: string; // 假设作者有 name 字段
    // 其他可能的作者字段...
  };
}

// 添加 Program 数据结构 (假设结构)
interface ProgramData {
  id: number;
  attributes: {
    programname: string; // 假设 Program 有 programname 字段
    // 其他可能的 Program 字段...
  };
}

// 博客列表项接口
interface BlogListItem {
  id: number | string;
  title_en: string;     // 英文标题
  title_zh: string;     // 中文标题
  slug: string;         // URL标识符
  publishedAt: string;  // 发布日期
  author?: AuthorData | null; // 新增：作者信息，保持 Strapi 结构
  coverImage?: string;  // 封面图片URL
  grade?: GradeData | null;            // 年级信息，保持原始Strapi结构
  program_type?: ProgramTypeData | null; // 项目类型信息，保持原始Strapi结构 - 保留以防万一
}

// 博客详情接口
export interface BlogDetail extends BlogListItem {
  content_en: unknown;      // 英文富文本内容
  content_zh: unknown;      // 中文富文本内容
  slideshow?: Array<{ url: string }>; // <--- 添加 slideshow
  authorName?: string | null; // <--- 添加 authorName
  grade_en?: string | null;       // 英文年级名称
  grade_zh?: string | null;       // 中文年级名称
  program_type_en?: string | null; // Add missing field
  program_type_zh?: string | null; // Add missing field
  // grade 和 program_type 保留在 BlogListItem 中定义的类型
}

// Strapi 返回数据接口
interface StrapiResponse<T> {
  data: T | T[]; // data 可以是单个对象或数组
  meta?: StrapiMeta; // meta 是可选的
}

// Strapi 博客条目 (调整为扁平结构以匹配 fields+populate 查询)
interface StrapiBlogItem {
  id: number;
  // 从 attributes 提升到顶层
  documentId?: string;
  title?: string;
  content?: any;
  Date?: string; // 旧日期字段
  slug?: string;
  publishedAt?: string; // 新日期字段
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  image?: ImageData; // 使用更新的 ImageData 接口
  Slideshow?: SlideshowData; // 使用更新的 SlideshowData 接口
  grade?: { id: number; grade: string }; // 调整为扁平查询返回的精确结构
  program_type?: { id: number; programname: string }; // 调整为扁平查询返回的精确结构
  author?: string | null | undefined; // 确认 author 是 string
  [key: string]: any; // 保持灵活性，以防其他未定义字段
  // 不再需要 attributes 字段
  // attributes: {
  //   ...
  // };
}

@Injectable()
export class BlogService {
  private strapiUrl: string;
  private strapiToken: string;
  private readonly logger = new Logger(BlogService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // --- 更直接的 DEBUG LOG ---
    this.logger.log(`[Constructor] process.env.STRAPI_API_TOKEN value: ${process.env.STRAPI_API_TOKEN}`);
    // --- END DEBUG LOG ---

    const strapiUrl = this.configService.get<string>('STRAPI_API_URL');
    const strapiToken = this.configService.get<string>('STRAPI_API_TOKEN');

    // --- DEBUG LOG START ---
    this.logger.debug(`[Constructor] Read STRAPI_API_TOKEN via ConfigService: ${strapiToken ? 'Token read (length: ' + strapiToken.length + ')' : 'Token NOT READ'}`);
    // this.logger.debug(`[Constructor] Token starts with: ${strapiToken?.substring(0, 5)}, ends with: ${strapiToken?.substring(strapiToken.length - 5)}`);
    this.logger.log(`[Constructor] Full STRAPI_API_TOKEN via ConfigService for debugging: ${strapiToken}`); // 临时完整日志
    // --- DEBUG LOG END ---

    if (!strapiUrl) {
      throw new InternalServerErrorException('STRAPI_API_URL not configured');
    }
    if (!strapiToken) {
      // 这个检查现在也很有用
      this.logger.error('[Constructor] STRAPI_API_TOKEN is missing or empty after reading from ConfigService!');
      throw new InternalServerErrorException('STRAPI_API_TOKEN not configured or empty');
    }
    // 确保 strapiUrl 不以 / 结尾
    this.strapiUrl = strapiUrl.replace(/\/$/, '');
    this.strapiToken = strapiToken; // 仍然使用 ConfigService 获取的值
  }

  // --- 公共方法 --- 

  /**
   * 获取指定 locale 的博客文章列表 (用于 Controller)
   * @param options 查询选项 (locale, page, limit)
   * @returns Strapi 响应数据及分页信息
   */
  async fetchSingleLocaleBlogList(options: {
    locale: string;
    page: number;
    limit: number;
  }): Promise<{ data: StrapiBlogItem[]; pagination: StrapiPagination | null }> {
    const { locale, page, limit } = options;
    const effectiveLocale = locale === 'zh-Hans' ? 'zh' : locale;

    // 1. 定义需要的基础字段
    const baseFields = ['title', 'author', 'publishedAt', 'Date', 'slug', 'content', 'documentId'];
    const fieldsParam = `fields=${baseFields.join(',')}`;

    // 2. 定义需要填充的关联字段 (简化方式，只列出字段名)
    const populateFields = ['image', 'grade', 'program_type', 'Slideshow'];
    const populateQuery = populateFields.map(field => `populate=${field}`).join('&');

    // 3. 构建分页和排序参数
    const paginationParams = `pagination[page]=${page}&pagination[pageSize]=${limit}`;
    const sortParam = `sort=publishedAt:desc`;
    const localeParam = `locale=${effectiveLocale}`;

    // 4. 构建完整 URL
    const url = `${this.strapiUrl}/api/blogposts?${localeParam}&${fieldsParam}&${populateQuery}&${paginationParams}&${sortParam}`;
    this.logger.log(`【fetchSingleLocaleBlogList】Requesting Strapi. URL: ${url}`);

    // 5. 发起请求并处理响应/错误
    try {
      const response = await firstValueFrom(
        this.httpService.get<{ data: StrapiBlogItem[], meta?: StrapiMeta }>(url, {
          headers: this.getStrapiHeaders(),
        }),
      );
      // Log the raw response data received from httpService
      this.logger.debug(`【fetchSingleLocaleBlogList】Raw response.data from httpService: ${JSON.stringify(response?.data)}`);

      const responseData = response?.data;
      
      if (!responseData || !responseData.data || !Array.isArray(responseData.data)) {
        this.logger.warn(`【fetchSingleLocaleBlogList】No valid blog data array found for locale: ${effectiveLocale}. Response data: ${JSON.stringify(responseData)}`);
        return { data: [], pagination: responseData?.meta?.pagination || null };
      }

      this.logger.log(`【fetchSingleLocaleBlogList】Successfully fetched ${responseData.data.length} blogs for locale: ${effectiveLocale}`);
      return {
        data: responseData.data,
        pagination: responseData.meta?.pagination || null,
      };
      
    } catch (error) {
      const status = error.response?.status;
      const errorData = error.response?.data;
      this.logger.error(`【fetchSingleLocaleBlogList】Error fetching blogs for locale ${effectiveLocale}. Status: ${status}. URL: ${url}. Error: ${error.message}`, error.stack);
      if (errorData) {
        this.logger.error(`【fetchSingleLocaleBlogList】Error response data: ${JSON.stringify(errorData)}`);
      }
      // 根据状态码或其他信息决定是返回空数组还是抛出异常
      // 例如，如果 404 可以认为是无数据，返回空数组
      if (status === 404) {
          return { data: [], pagination: null };
      }
      // 其他错误视为内部错误
      throw new InternalServerErrorException(`获取 locale=${effectiveLocale} 的博客时出错 (Service Layer)`);
    }
  }

  /**
   * 获取所有已发布的博客文章列表（合并中英文）
   */
  async findAll(): Promise<BlogListItem[]> {
    this.logger.log('【findAll】开始获取所有博客列表...');
    try {
      const [enBlogs, zhBlogs] = await Promise.all([
        this.fetchBlogsByLocale('en'),
        this.fetchBlogsByLocale('zh'),
      ]);
      
      const mergedList = this.mergeBlogData(enBlogs, zhBlogs);
      this.logger.log(`【findAll】成功获取并合并了 ${mergedList.length} 条博客记录。`);
      return mergedList;

    } catch (error) {
      this.logger.error('【findAll】获取博客列表时出错:', error.stack || error.message);
      if (error instanceof NotFoundException) {
         throw error;
      }
      throw new InternalServerErrorException('获取博客列表时发生内部错误');
    }
  }

  /**
   * 根据 slug 获取单个博客文章详情（合并中英文）
   */
  async findOneBySlug(slug: string): Promise<BlogDetail> {
    this.logger.log(`【findOneBySlug】开始处理 slug: ${slug}`);
    let documentId: string | undefined;
    let initialBlog: StrapiBlogItem | null = null;

    // 1. 尝试获取任一语言版本以获取 documentId
    try {
      // 优先尝试英文
      initialBlog = await this.fetchBlogBySlugAndLocale(slug, 'en');
      if (initialBlog?.documentId) {
        documentId = initialBlog.documentId;
        this.logger.log(`【findOneBySlug】从英文版本获取到 documentId: ${documentId}`);
      }
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.warn(`【findOneBySlug】尝试获取英文版本时出错 (非 NotFound): ${error.message}`);
        // 对于非 404 错误，可能需要向上抛出或记录更详细信息
      }
    }

    if (!documentId) {
      try {
        // 如果英文失败或无 documentId，尝试中文
        initialBlog = await this.fetchBlogBySlugAndLocale(slug, 'zh');
        if (initialBlog?.documentId) {
          documentId = initialBlog.documentId;
          this.logger.log(`【findOneBySlug】从中文版本获取到 documentId: ${documentId}`);
        } else {
          // 如果两个版本都找不到或者都没有 documentId，则认为是真的找不到了
           this.logger.error(`【findOneBySlug】中文版本也未找到或无 documentId for slug: ${slug}`);
           throw new NotFoundException(`未找到 slug=${slug} 对应的博客或其 documentId`);
        }
      } catch (error) {
         if (error instanceof NotFoundException) {
            this.logger.warn(`【findOneBySlug】中英文版本均未找到 slug: ${slug}`);
            throw error; // 重新抛出 NotFoundException
         } else {
            this.logger.error(`【findOneBySlug】尝试获取中文版本时出错: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`获取 slug=${slug} 的 documentId 时发生错误`);
         }
      }
    }

    // 2. 使用 documentId 获取完整的中英文数据
    let enBlogData: StrapiBlogItem | null = null;
    let zhBlogData: StrapiBlogItem | null = null;

    try {
      enBlogData = await this.fetchBlogByDocumentIdAndLocale(documentId, 'en');
      this.logger.log(`【findOneBySlug】成功使用 documentId 获取英文数据`);
    } catch (error) {
        if (error instanceof NotFoundException) {
             this.logger.warn(`【findOneBySlug】未找到 documentId=${documentId} 的英文版本`);
        } else {
            this.logger.error(`【findOneBySlug】使用 documentId 获取英文数据时出错: ${error.message}`, error.stack);
            // 这里可以选择是否抛出错误，或者允许只返回中文
        }
    }

    try {
      zhBlogData = await this.fetchBlogByDocumentIdAndLocale(documentId, 'zh');
      this.logger.log(`【findOneBySlug】成功使用 documentId 获取中文数据`);
    } catch (error) {
       if (error instanceof NotFoundException) {
             this.logger.warn(`【findOneBySlug】未找到 documentId=${documentId} 的中文版本`);
        } else {
            this.logger.error(`【findOneBySlug】使用 documentId 获取中文数据时出错: ${error.message}`, error.stack);
             // 这里可以选择是否抛出错误，或者允许只返回英文
        }
    }

    // 3. 检查是否至少获取到了一个版本的数据
    if (!enBlogData && !zhBlogData) {
        this.logger.error(`【findOneBySlug】使用 documentId ${documentId} 未能获取到任何语言版本的数据`);
        throw new NotFoundException(`未找到 documentId=${documentId} (来自 slug=${slug}) 的任何语言版本`);
    }

    // 4. 合并数据
    const mergedDetail = this.mergeBlogDetailData(enBlogData, zhBlogData);
    this.logger.log(`【findOneBySlug】成功合并 slug=${slug} 的中英文数据`);
    return mergedDetail;
  }
  
  // --- 私有 Strapi API 调用方法 --- 

  /**
   * 根据 locale 获取博客列表
   */
  private async fetchBlogsByLocale(locale: string): Promise<StrapiBlogItem[]> {
    const populateFields = ['image', 'grade', 'program_type', 'author'];
    const populateQuery = populateFields.map(field => {
      if (field === 'author') return `populate[${field}][fields][0]=name`;
      if (field === 'grade') return `populate[${field}][fields][0]=grade`;
      if (field === 'program_type') return `populate[${field}][fields][0]=programname`;
      if (field === 'image') return `populate[${field}][fields][0]=url&populate[${field}][fields][1]=formats`;
      return `populate[${field}]=*`;
    }).join('&');
    
    const url = `${this.strapiUrl}/api/blogposts?locale=${locale}&${populateQuery}&pagination[pageSize]=100&sort=publishedAt:desc`;
    this.logger.log(`【fetchBlogsByLocale】Fetching blogs. Locale: ${locale}. URL: ${url}`);

    try {
      const response = await firstValueFrom(
        this.httpService.get<{ data: StrapiBlogItem[], meta?: StrapiMeta }>(url, {
          headers: this.getStrapiHeaders(),
        }),
      );
      const responseData = response?.data;
      if (!responseData || !responseData.data || !Array.isArray(responseData.data)) {
        this.logger.warn(`【fetchBlogsByLocale】No valid blog data array found for locale: ${locale}. Response data: ${JSON.stringify(responseData)}`);
        return [];
      }
      if (responseData.data.length > 0) {
          this.logger.debug(`【fetchBlogsByLocale】Raw data received for first blog (locale: ${locale}): ${JSON.stringify(responseData.data[0], null, 2)}`);
      }
      this.logger.log(`【fetchBlogsByLocale】Successfully fetched ${responseData.data.length} blogs for locale: ${locale}`);
      return responseData.data;
    } catch (error) {
       const status = error.response?.status;
       const errorData = error.response?.data;
       this.logger.error(`【fetchBlogsByLocale】Error fetching blogs for locale ${locale}. Status: ${status}. URL: ${url}. Error: ${error.message}`, error.stack);
       if (errorData) {
           this.logger.error(`【fetchBlogsByLocale】Error response data: ${JSON.stringify(errorData)}`);
       }
       if (status === 404) {
         this.logger.warn(`【fetchBlogsByLocale】Strapi returned 404 for locale ${locale}, assuming no blogs.`);
         return [];
       }
       throw new InternalServerErrorException(`获取 locale=${locale} 的博客时出错`);
    }
  }

  /**
   * 根据 slug 和 locale 获取单个博客
   */
  private async fetchBlogBySlugAndLocale(slug: string, locale: string): Promise<StrapiBlogItem | null> {
    this.logger.log(`【fetchBlogBySlugAndLocale】入口 - Slug: ${slug}, Locale: ${locale}`);
    
    // --- 修正：分离基础字段和 Populate 查询 --- 
    const baseFields = ['title', 'author', 'publishedAt', 'Date', 'slug', 'content', 'documentId'];
    const fieldsParam = `fields=${baseFields.join(',')}`;
    const populateQuery = this.getDetailPopulateQuery(); // 获取只包含 populate 的部分
    
    const url = `${this.strapiUrl}/api/blogposts?filters[slug][$eq]=${slug}&locale=${locale}&${fieldsParam}&${populateQuery}`;
    this.logger.log(`【fetchBlogBySlugAndLocale】构造的 Strapi 请求 URL: ${url}`);
    
    try {
      const response = await firstValueFrom(
          this.httpService.get<{ data: StrapiBlogItem[], meta?: StrapiMeta }>(url, {
              headers: this.getStrapiHeaders(),
          }),
      );
      this.logger.debug(`【fetchBlogBySlugAndLocale】Strapi 原始响应 (slug=${slug}, locale=${locale}): ${JSON.stringify(response?.data)}`);
      
      const responseData = response?.data;
      if (responseData?.data && Array.isArray(responseData.data) && responseData.data.length > 0) {
          this.logger.log(`【fetchBlogBySlugAndLocale】找到博客 ID: ${responseData.data[0].id}`);
          return responseData.data[0];
      } else {
          this.logger.warn(`【fetchBlogBySlugAndLocale】未找到博客。`);
          return null;
      }
    } catch (error) {
        const status = error.response?.status;
        const errorData = error.response?.data;
        // 记录更详细的错误信息，包括 Strapi 返回的数据
        this.logger.error(
            `【fetchBlogBySlugAndLocale】请求失败. Slug: ${slug}, Locale: ${locale}. Status: ${status}. Error: ${error.message}`,
            error.stack,
            errorData ? `Strapi Response Data: ${JSON.stringify(errorData)}` : 'No Strapi error data'
        );
        if (status === 404) {
            return null;
        }
        // 重新抛出错误，但使用更具体的错误信息（如果可用）
        const errorMessage = errorData?.error?.message || error.message || `获取 slug=${slug}, locale=${locale} 的博客时发生未知错误`;
        throw new InternalServerErrorException(errorMessage);
    }
  }

  /**
   * 根据 documentId 和 locale 获取单个博客
   */
  private async fetchBlogByDocumentIdAndLocale(documentId: string, locale: string): Promise<StrapiBlogItem | null> {
    this.logger.log(`【fetchBlogByDocumentIdAndLocale】入口 - DocID: ${documentId}, Locale: ${locale}`);

    // --- 修正：分离基础字段和 Populate 查询 --- 
    const baseFields = ['title', 'author', 'publishedAt', 'Date', 'slug', 'content', 'documentId'];
    const fieldsParam = `fields=${baseFields.join(',')}`;
    const populateQuery = this.getDetailPopulateQuery(); // 获取只包含 populate 的部分

    const url = `${this.strapiUrl}/api/blogposts?filters[documentId][$eq]=${documentId}&locale=${locale}&${fieldsParam}&${populateQuery}`;
    this.logger.log(`【fetchBlogByDocumentIdAndLocale】构造的 Strapi 请求 URL: ${url}`);
    
    try {
        const response = await firstValueFrom(
            this.httpService.get<{ data: StrapiBlogItem[], meta?: StrapiMeta }>(url, { 
                headers: this.getStrapiHeaders(),
            }),
        );
        this.logger.debug(`【fetchBlogByDocumentIdAndLocale】Strapi 原始响应 (docId=${documentId}, locale=${locale}): ${JSON.stringify(response?.data)}`);
        
        const responseData = response?.data;
        if (responseData?.data && Array.isArray(responseData.data) && responseData.data.length > 0) {
            this.logger.log(`【fetchBlogByDocumentIdAndLocale】找到博客 ID: ${responseData.data[0].id}`);
            return responseData.data[0];
        } else {
            this.logger.warn(`【fetchBlogByDocumentIdAndLocale】未找到博客。`);
            return null;
        }
    } catch (error) {
        const status = error.response?.status;
        const errorData = error.response?.data;
        // 记录更详细的错误信息
        this.logger.error(
            `【fetchBlogByDocumentIdAndLocale】请求失败. DocID: ${documentId}, Locale: ${locale}. Status: ${status}. Error: ${error.message}`,
            error.stack,
            errorData ? `Strapi Response Data: ${JSON.stringify(errorData)}` : 'No Strapi error data'
        );
        if (status === 404) {
            return null;
        }
        // 重新抛出错误，但使用更具体的错误信息
        const errorMessage = errorData?.error?.message || error.message || `获取 documentId=${documentId}, locale=${locale} 的博客时发生未知错误`;
        throw new InternalServerErrorException(errorMessage);
    }
  }

  // --- 数据合并与处理方法 --- 

  /**
   * 合并中英文博客列表数据
   */
  private mergeBlogData(enBlogs: StrapiBlogItem[], zhBlogs: StrapiBlogItem[]): BlogListItem[] {
    this.logger.log(`【mergeBlogData】开始合并 ${enBlogs.length} 篇英文博客和 ${zhBlogs.length} 篇中文博客`);
    const blogMap = new Map<string, Partial<BlogListItem>>();

    const processBlog = (blog: StrapiBlogItem, lang: 'en' | 'zh') => {
      if (!blog || !blog.documentId) {
        this.logger.warn(`【mergeBlogData】Skipping invalid blog item: ${JSON.stringify(blog)}`);
        return;
      }
      
      const docId = blog.documentId;
      this.logger.debug(`【mergeBlogData】Processing blog ID ${blog.id} (docId: ${docId}, lang: ${lang}). Author data: ${JSON.stringify(blog.author)}. Program Type data: ${JSON.stringify(blog.program_type)}`);

      if (!blogMap.has(docId)) {
        blogMap.set(docId, { id: docId }); 
      }
      const existing = blogMap.get(docId)!;

      existing.slug = existing.slug || blog.slug || `blog-${blog.id}`; 
      existing.publishedAt = existing.publishedAt || blog.publishedAt || blog.Date || new Date().toISOString(); 

      if (lang === 'en') {
        existing.title_en = blog.title || '';
      } else {
        existing.title_zh = blog.title || '';
      }
      
      existing.author = existing.author === undefined ? { id: 0, attributes: { name: blog.author || 'Unknown' } } : existing.author;

      if (existing.coverImage === undefined) { 
        existing.coverImage = this.extractImageUrl(blog.image);
      }
      if (existing.grade === undefined) { 
        existing.grade = this.extractGradeData(blog.grade);
         this.logger.debug(`【mergeBlogData】Mapped grade for docId ${docId}: ${JSON.stringify(existing.grade)}`);
      }
      if (existing.program_type === undefined) { 
        existing.program_type = this.extractProgramTypeData(blog.program_type);
         this.logger.debug(`【mergeBlogData】Mapped program_type for docId ${docId}: ${JSON.stringify(existing.program_type)}`);
      }
    };

    enBlogs.forEach(blog => processBlog(blog, 'en'));
    zhBlogs.forEach(blog => processBlog(blog, 'zh'));

    const resultList = Array.from(blogMap.values()).map(item => {
      // Ensure grade and program_type fit the interface
      const finalGrade: GradeData | null = item.grade ? { id: item.grade.id, grade: item.grade.name || '', documentId: item.grade.documentId } : null;
      const finalProgramType: ProgramTypeData | null = item.program_type ? { id: item.program_type.id, programname: item.program_type.name || '', documentId: item.program_type.documentId } : null;

      return {
        id: item.id!,
        title_en: item.title_en || '',
        title_zh: item.title_zh || '',
        slug: item.slug || '',
        publishedAt: item.publishedAt || '',
        author: item.author !== undefined ? item.author : null,
        coverImage: item.coverImage || '',
        grade: finalGrade,
        program_type: finalProgramType,
      }
    }).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    this.logger.log(`【mergeBlogData】合并完成，生成 ${resultList.length} 条博客列表项`);
    if (resultList.length > 0) {
        this.logger.debug(`【mergeBlogData】Structure of the first merged blog item: ${JSON.stringify(resultList[0], null, 2)}`);
    }
    return resultList as BlogListItem[]; 
  }

  /**
   * 合并单个博客的中英文详情数据
   */
  private mergeBlogDetailData(enBlog: StrapiBlogItem | null, zhBlog: StrapiBlogItem | null): BlogDetail {
    this.logger.log(`【mergeBlogDetailData】开始合并. EN Blog ID: ${enBlog?.id}, ZH Blog ID: ${zhBlog?.id}`);
    // Use English data as the base, or Chinese if English is missing
    const baseBlog = enBlog || zhBlog;
    if (!baseBlog) {
        this.logger.error("【mergeBlogDetailData】英文和中文博客数据都为空，无法合并！");
        throw new InternalServerErrorException("无法合并博客详情，因为两个语言版本的数据都缺失。");
    }

    // Extract base info (prefer English if available)
    const id = baseBlog.id;
    const slug = enBlog?.slug || zhBlog?.slug || 'no-slug'; // Fallback slug
    const publishedAt = enBlog?.publishedAt || zhBlog?.publishedAt || new Date().toISOString();
    const documentId = baseBlog.documentId || 'no-document-id'; // Fallback documentId

    // --- 正确提取和分离字段 --- 
    const title_en = enBlog?.title || zhBlog?.title || 'Untitled'; // Fallback to ZH title if EN missing
    const title_zh = zhBlog?.title || enBlog?.title || '无标题';   // Fallback to EN title if ZH missing
    const content_en = enBlog?.content || zhBlog?.content || [];     // Fallback to ZH content
    const content_zh = zhBlog?.content || enBlog?.content || [];     // Fallback to EN content
    const authorName_en = enBlog?.author || null; // Directly use the author field from EN
    const authorName_zh = zhBlog?.author || enBlog?.author || null; // Fallback to EN author
    
    // --- 提取 Grade & Program Type --- 
    const gradeData_en = this.extractGradeData(enBlog?.grade);
    const gradeData_zh = this.extractGradeData(zhBlog?.grade);
    const programTypeData_en = this.extractProgramTypeData(enBlog?.program_type);
    const programTypeData_zh = this.extractProgramTypeData(zhBlog?.program_type);

    // --- 提取 Slideshow & Cover Image --- 
    const slideshowUrls = this.extractSlideshowUrls(enBlog?.Slideshow || zhBlog?.Slideshow);
    const slideshow = slideshowUrls.map(url => ({ url })); // Correctly map string[] to {url: string}[]
    const coverImage = this.extractImageUrl(enBlog?.image || zhBlog?.image);

    const merged: BlogDetail = {
        id,
        slug,
        publishedAt,
        documentId,
        title_en,
        title_zh,
        content_en,
        content_zh,
        authorName: authorName_en,
        coverImage,
        slideshow, // Assign the correctly mapped array
        // Assign grade/program_type ensuring type compatibility
        grade: gradeData_en ? { ...gradeData_en, grade: gradeData_en.name || '' } : null,
        program_type: programTypeData_en ? { ...programTypeData_en, programname: programTypeData_en.name || '' } : null,
        // Assign specific language fields
        grade_en: gradeData_en?.name || null,
        grade_zh: gradeData_zh?.name || gradeData_en?.name || null,
        program_type_en: programTypeData_en?.name || null,
        program_type_zh: programTypeData_zh?.name || programTypeData_en?.name || null,
    };
    this.logger.debug(`【mergeBlogDetailData】合并结果 (部分): id=${merged.id}, slug=${merged.slug}, title_en=${merged.title_en ? 'OK' : 'MISSING'}, title_zh=${merged.title_zh ? 'OK' : 'MISSING'}, grade_en=${merged.grade_en}, grade_zh=${merged.grade_zh}, pt_en=${merged.program_type_en}, pt_zh=${merged.program_type_zh}`);
    return merged;
  }

  // --- 辅助方法 --- 

  /**
   * 获取 Strapi API 请求头
   */
  private getStrapiHeaders(): Record<string, string> {
    // --- DEBUG LOG START ---
    this.logger.debug(`[getStrapiHeaders] Using token (length: ${this.strapiToken?.length}) for Authorization header.`);
    this.logger.log(`[getStrapiHeaders] Full token being used: ${this.strapiToken}`); // 临时完整日志
    // --- DEBUG LOG END ---
    if (!this.strapiToken) {
        this.logger.error('[getStrapiHeaders] Attempting to create headers but this.strapiToken is empty!');
        // 可以选择抛出错误或返回不含 Authorization 的头，取决于你的策略
        // throw new InternalServerErrorException('Cannot create Strapi headers: Token is missing');
        return {}; // 返回空头可能导致 401，符合当前情况
    }
    return {
      Authorization: `Bearer ${this.strapiToken}`,
    };
  }

  /**
   * 获取用于详情查询的 populate 查询字符串 (只返回 populate 部分)
   */
  private getDetailPopulateQuery(): string {
      const populateParams = [
          `populate[image][fields][0]=url&populate[image][fields][1]=formats`, // image
          `populate[Slideshow][fields][0]=url&populate[Slideshow][fields][1]=formats`, // Slideshow
          `populate[grade][fields][0]=id&populate[grade][fields][1]=grade`, // 精确指定 grade 字段
          `populate[program_type][fields][0]=id&populate[program_type][fields][1]=programname` // 精确指定 program_type 字段
      ];
      // 注意：不再包含 content 或 author
      return populateParams.join('&');
  }

  /**
   * 安全地提取单个图片 URL
   */
  private extractImageUrl(imageData?: ImageData | string | null): string {
    if (!imageData) return '';
    if (typeof imageData === 'string') {
        return this.ensureFullUrl(imageData);
    }
    if (imageData.data?.attributes?.url) {
      return this.ensureFullUrl(imageData.data.attributes.url);
    }
    if (imageData.url) {
      return this.ensureFullUrl(imageData.url);
    }
    this.logger.warn(`【extractImageUrl】无法从数据中提取有效的图片 URL: ${JSON.stringify(imageData)}`);
    return '';
  }

  /**
   * 安全地提取幻灯片图片 URL 数组
   */
  private extractSlideshowUrls(slideshowData?: SlideshowData | Array<Record<string, any>> | null): string[] { // 允许传入扁平对象数组
    if (!slideshowData) return [];
    
    let items: Array<Record<string, any>> = []; 

    // 检查是否已经是扁平数组 (来自 fields+populate 查询)
    if (Array.isArray(slideshowData)) {
      items = slideshowData;
    }
    // 检查是否是嵌套结构 (来自 populate=* 查询)
    else if (slideshowData.data && Array.isArray(slideshowData.data)) {
      items = slideshowData.data;
    }
    else if (slideshowData.items && Array.isArray(slideshowData.items)) { // 支持旧的 items 结构 (以防万一)
        items = slideshowData.items;
    }

    if (items.length === 0) {
        this.logger.debug("【extractSlideshowUrls】未找到有效的幻灯片项目数组。");
        return [];
    }

    const urls = items
      .map(item => {
        // --- 修改：优先检查顶层 url --- 
        if (item && typeof item === 'object' && typeof item.url === 'string') {
            return this.ensureFullUrl(item.url);
        }
        // --- 保留对嵌套结构的兼容性检查 --- 
        if (item && typeof item === 'object' && 'attributes' in item && item.attributes?.url) {
            return this.ensureFullUrl(item.attributes.url);
        }
        if (item && typeof item === 'object' && 'data' in item && item.data?.attributes?.url) {
            return this.ensureFullUrl(item.data.attributes.url);
        }
        
        this.logger.warn(`【extractSlideshowUrls】无法从幻灯片项提取 URL: ${JSON.stringify(item)}`);
        return '';
      })
      .filter(url => !!url);

    this.logger.debug(`【extractSlideshowUrls】从 ${items.length} 个项目中提取了 ${urls.length} 个幻灯片 URL`);
    return urls;
  }

  /**
   * 确保 URL 是完整的绝对路径 (加上 Strapi Base URL)
   */
  private ensureFullUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const baseUrl = this.strapiUrl.replace(/\/api$/, ''); 
    const fullUrl = `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
    return fullUrl;
  }

  // --- 关联数据提取辅助方法 --- 

  /**
   * 提取年级数据
   */
  private extractGradeData(gradeField: any): { id: number; name: string; documentId?: string } | null {
      if (gradeField && typeof gradeField === 'object' && gradeField.id && gradeField.grade) {
          this.logger.debug(`【extractGradeData】Extracted: id=${gradeField.id}, name=${gradeField.grade}, docId=${gradeField.documentId}`);
          return {
              id: gradeField.id,
              name: gradeField.grade, // Use 'grade' field as the name
              documentId: gradeField.documentId
          };
      }
      this.logger.warn(`【extractGradeData】Input field was invalid or missing required properties: ${JSON.stringify(gradeField)}`);
      return null;
  }

  /**
   * 提取项目类型数据
   */
  private extractProgramTypeData(programTypeField: any): { id: number; name: string; documentId?: string } | null {
      if (programTypeField && typeof programTypeField === 'object' && programTypeField.id && programTypeField.programname) {
          this.logger.debug(`【extractProgramTypeData】Extracted: id=${programTypeField.id}, name=${programTypeField.programname}, docId=${programTypeField.documentId}`);
          return {
              id: programTypeField.id,
              name: programTypeField.programname, // Use 'programname' field as the name
              documentId: programTypeField.documentId
          };
      }
      this.logger.warn(`【extractProgramTypeData】Input field was invalid or missing required properties: ${JSON.stringify(programTypeField)}`);
      return null;
  }
  
  /**
   * 提取作者数据
   * @deprecated This function assumes a relation structure, but author is now a string.
   */
  private extractAuthorData(authorRelation?: { data?: StrapiDataItem<AuthorData['attributes']> } | null): AuthorData | null {
      // Revert to the original implementation, although it's likely unused now.
      if (authorRelation?.data?.attributes) {
          const attr = authorRelation.data.attributes;
          if (typeof attr.name !== 'string') {
              this.logger.warn(`【extractAuthorData】Author data found (ID: ${authorRelation.data.id}) but 'name' attribute is missing or not a string: ${JSON.stringify(attr)}`);
          }
          return {
              id: authorRelation.data.id,
              attributes: {
                  name: attr.name || 'Unknown Author',
              },
          };
      }
      return null;
  }

  // --- 可能被 Controller 使用的公共辅助方法 --- 

  /**
   * 获取 Strapi 基础 URL
   * @deprecated 不推荐直接暴露 URL
   */
  public getStrapiUrl(): string {
      this.logger.warn("【getStrapiUrl】被调用，不推荐直接暴露 Strapi URL。");
      return this.strapiUrl;
  }

  /**
   * 通用 Strapi API GET 请求方法 (简化版)
   * @param relativePath API 相对路径 (例如 /api/blogposts)
   * @param params 查询参数对象
   * @returns API 响应数据
   * @deprecated 推荐在 Service 内部封装具体业务逻辑调用
   */
  public async fetchStrapiApi<TResponse = any>(relativePath: string, params: Record<string, any> = {}): Promise<TResponse> {
    const url = new URL(`${this.strapiUrl}${relativePath}`);
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, String(value)));
    const fullUrl = url.toString();

    this.logger.warn(`【fetchStrapiApi】被调用 (不推荐)。URL: ${fullUrl}`);
    try {
      const response = await firstValueFrom(
        this.httpService.get<TResponse>(fullUrl, {
          headers: this.getStrapiHeaders(),
        }),
      );
      if (!response || response.status >= 400) {
          const errorMsg = `Strapi API request failed with status ${response?.status}`;
          this.logger.error(`${errorMsg}. URL: ${fullUrl}. Response: ${JSON.stringify(response?.data)}`);
          throw new InternalServerErrorException(errorMsg);
      }
      this.logger.log(`【fetchStrapiApi】Request successful. Status: ${response.status}. URL: ${fullUrl}`);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const errorData = error.response?.data;
      this.logger.error(`【fetchStrapiApi】Request failed. Status: ${status}. URL: ${fullUrl}. Error: ${error.message}`, error.stack);
       if (errorData) {
          this.logger.error(`【fetchStrapiApi】Error response data: ${JSON.stringify(errorData)}`);
      }
      throw new InternalServerErrorException(`Failed to fetch from Strapi API: ${relativePath}`);
    }
  }

} // End of BlogService class
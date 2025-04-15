import axios from 'axios';
import { strapiConfig, getFullUrl } from '../config/strapi.mjs';

// 创建一个带有默认配置的axios实例
const strapiAxios = axios.create({
  baseURL: strapiConfig.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    ...(strapiConfig.apiToken ? { 'Authorization': `Bearer ${strapiConfig.apiToken}` } : {})
  }
});

// 日志函数
const log = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

// 错误日志函数
const logError = (message, error) => {
  console.error(`[${new Date().toISOString()}] ${message}`, error);
};

/**
 * 获取博客文章列表
 */
export const getAllBlogs = async (req, res) => {
  const locale = req.query.locale || 'zh';
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 6;

  log(`【请求处理 /blog】Locale=${locale}, Page=${page}, Limit=${limit}`);

  try {
    // 构建Strapi API请求URL
    const baseFields = ['title', 'author', 'publishedAt', 'Date', 'slug', 'content', 'documentId'];
    const fieldsParam = `fields=${baseFields.join(',')}`;
    const populateFields = ['image', 'grade', 'programtype', 'Slideshow'];
    const populateQuery = populateFields.map(field => `populate=${field}`).join('&');

    const url = `${strapiConfig.blogPostsEndpoint}?locale=${locale}&pagination[page]=${page}&pagination[pageSize]=${limit}&${populateQuery}`;

    log(`【getAllBlogs】Strapi请求URL: ${url}`);

    // 发送请求到Strapi
    const response = await strapiAxios.get(url);

    if (!response.data || !response.data.data) {
      throw new Error('Strapi API返回无效数据');
    }

    const strapiBlogs = response.data.data;
    const pagination = response.data.meta?.pagination;

    const totalPages = pagination?.pageCount || 1;
    const totalPosts = pagination?.total || strapiBlogs.length;

    log(`【getAllBlogs】Strapi返回 ${strapiBlogs.length} 篇博客。总页数: ${totalPages}, 总文章数: ${totalPosts}`);

    // 将Strapi数据映射为前端格式
    const mappedPosts = strapiBlogs.map(blog => {
      const mappedBlog = mapStrapiToFrontendListFormat(blog);
      // 添加调试日志
      log(`【getAllBlogs】映射博客 ID: ${blog.id}, 标题: ${blog.attributes?.title || 'N/A'}, 映射结果: ${mappedBlog ? 'success' : 'failed'}`);
      return mappedBlog;
    }).filter(Boolean); // 过滤掉null值

    log(`【getAllBlogs】成功映射 ${mappedPosts.length} 篇博客`);

    // 添加调试日志
    log(`【getAllBlogs】返回数据: ${JSON.stringify({ totalPages, totalPosts, postsCount: mappedPosts.length })}`);

    // 返回响应
    res.json({
      posts: mappedPosts,
      totalPages,
      totalPosts
    });
  } catch (error) {
    logError('【getAllBlogs】处理博客列表请求失败:', error);
    // 返回空列表，避免前端错误
    res.json({
      posts: [],
      totalPages: 0,
      totalPosts: 0
    });
  }
};

/**
 * 根据slug获取单个博客文章
 */
export const getBlogBySlug = async (req, res) => {
  const { slug } = req.params;

  log(`【请求处理 /blog/:slug】请求的 slug=${slug}`);

  try {
    // 尝试获取英文版本
    let documentId = null;
    let enBlog = null;
    let zhBlog = null;

    try {
      enBlog = await fetchBlogBySlugAndLocale(slug, 'en');
      if (enBlog?.attributes?.documentId) {
        documentId = enBlog.attributes.documentId;
        log(`【getBlogBySlug】从英文版本获取到 documentId: ${documentId}`);
      }
    } catch (error) {
      log(`【getBlogBySlug】尝试获取英文版本时出错: ${error.message}`);
    }

    // 如果没有找到英文版本，尝试中文版本
    if (!documentId) {
      try {
        zhBlog = await fetchBlogBySlugAndLocale(slug, 'zh');
        if (zhBlog?.attributes?.documentId) {
          documentId = zhBlog.attributes.documentId;
          log(`【getBlogBySlug】从中文版本获取到 documentId: ${documentId}`);
        }
      } catch (error) {
        log(`【getBlogBySlug】尝试获取中文版本时出错: ${error.message}`);
      }
    }

    // 如果找到了documentId，尝试获取另一种语言的版本
    if (documentId) {
      if (!enBlog) {
        try {
          enBlog = await fetchBlogByDocumentIdAndLocale(documentId, 'en');
        } catch (error) {
          log(`【getBlogBySlug】通过documentId获取英文版本时出错: ${error.message}`);
        }
      }

      if (!zhBlog) {
        try {
          zhBlog = await fetchBlogByDocumentIdAndLocale(documentId, 'zh');
        } catch (error) {
          log(`【getBlogBySlug】通过documentId获取中文版本时出错: ${error.message}`);
        }
      }
    }

    // 如果两种语言都没有找到，返回404
    if (!enBlog && !zhBlog) {
      log(`【getBlogBySlug】未找到 slug=${slug} 的博客`);
      return res.status(404).json({
        message: `未找到 slug=${slug} 的博客`,
        success: false
      });
    }

    // 合并两种语言的数据
    const blogDetail = mergeBlogData(enBlog, zhBlog);

    log(`【getBlogBySlug】成功获取 slug=${slug} 的详情`);
    res.json(blogDetail);
  } catch (error) {
    logError(`【getBlogBySlug】处理 slug=${slug} 请求失败:`, error);
    res.status(500).json({
      message: `获取 slug=${slug} 的博客详情时发生错误`,
      success: false,
      error: error.message
    });
  }
};

/**
 * 测试Strapi连接
 */
export const testStrapiConnection = async (req, res) => {
  const locale = req.query.locale;
  const limit = req.query.limit;
  const fields = req.query.fields;
  const populate = req.query.populate;

  log(`执行Strapi连接测试, 参数: locale=${locale}, limit=${limit}, fields=${fields}, populate=${populate}`);

  let url = `${strapiConfig.blogPostsEndpoint}?populate=${populate || '*'}`;
  if (locale) {
    url += `&locale=${locale}`;
  }
  if (limit) {
    url += `&pagination[limit]=${limit}`;
  }

  log(`Strapi请求URL: ${url}`);

  try {
    const response = await strapiAxios.get(url);

    res.json({
      status: 'success',
      message: 'Strapi连接成功',
      url: url,
      data: {
        meta: response.data.meta,
        count: Array.isArray(response.data.data) ? response.data.data.length : 0
      }
    });
  } catch (error) {
    logError('Strapi连接测试失败:', error);

    res.status(500).json({
      status: 'error',
      message: 'Strapi连接失败',
      url: url,
      error: error.message
    });
  }
};

/**
 * 获取原始Strapi响应
 */
export const getRawStrapiResponse = async (req, res) => {
  const locale = req.query.locale;
  const fields = req.query.fields;
  const populate = req.query.populate;

  log(`获取原始Strapi响应，参数: locale=${locale}, fields=${fields}, populate=${populate}`);

  let url = `${strapiConfig.blogPostsEndpoint}?`;
  url += `populate=${populate || '*'}`;
  if (locale) url += `&locale=${locale}`;
  if (fields) url += `&fields=${fields}`;

  log(`原始Strapi请求URL: ${url}`);

  try {
    const response = await strapiAxios.get(url);

    res.json({
      status: 200,
      url: url,
      data: response.data
    });
  } catch (error) {
    logError(`获取原始Strapi响应失败:`, error);

    res.status(500).json({
      status: 500,
      error: error.message,
      url: url
    });
  }
};

/**
 * 获取原始Strapi数据
 */
export const getRawStrapiData = async (req, res) => {
  const locale = req.query.locale || 'zh';
  const populate = req.query.populate || '*';
  const fields = req.query.fields || '';
  const limit = req.query.limit || '1';

  log(`获取原始Strapi数据，locale=${locale}, populate=${populate}, fields=${fields}, limit=${limit}`);

  try {
    let url = `${strapiConfig.blogPostsEndpoint}?populate=${populate}&locale=${locale}&pagination[pageSize]=${limit}`;
    if (fields) {
      url += `&fields=${fields}`;
    }

    log(`请求URL: ${url}`);

    const response = await strapiAxios.get(url);

    if (!response || !response.data) {
      throw new Error('Strapi API返回空响应');
    }

    res.json({
      status: 'success',
      url: url,
      data: response.data
    });
  } catch (error) {
    logError(`获取原始Strapi数据失败:`, error);

    res.status(500).json({
      status: 'error',
      message: '获取原始Strapi数据失败',
      error: error.message
    });
  }
};

// --- 辅助函数 ---

/**
 * 根据slug和locale获取单个博客
 */
async function fetchBlogBySlugAndLocale(slug, locale) {
  log(`【fetchBlogBySlugAndLocale】入口 - Slug: ${slug}, Locale: ${locale}`);

  const baseFields = ['title', 'author', 'publishedAt', 'Date', 'slug', 'content', 'documentId'];
  const fieldsParam = `fields=${baseFields.join(',')}`;
  const populateFields = ['image', 'grade', 'programtype', 'Slideshow'];
  const populateQuery = populateFields.map(field => `populate=${field}`).join('&');

  const url = `${strapiConfig.blogPostsEndpoint}?filters[slug][$eq]=${slug}&locale=${locale}&${fieldsParam}&${populateQuery}`;
  log(`【fetchBlogBySlugAndLocale】构造的 Strapi 请求 URL: ${url}`);

  try {
    const response = await strapiAxios.get(url);

    log(`【fetchBlogBySlugAndLocale】Strapi 响应状态: ${response.status}`);

    const responseData = response?.data;
    if (responseData?.data && Array.isArray(responseData.data) && responseData.data.length > 0) {
      log(`【fetchBlogBySlugAndLocale】找到博客 ID: ${responseData.data[0].id}`);
      return responseData.data[0];
    } else {
      log(`【fetchBlogBySlugAndLocale】未找到博客。`);
      return null;
    }
  } catch (error) {
    logError(`【fetchBlogBySlugAndLocale】请求失败:`, error);
    throw error;
  }
}

/**
 * 根据documentId和locale获取单个博客
 */
async function fetchBlogByDocumentIdAndLocale(documentId, locale) {
  log(`【fetchBlogByDocumentIdAndLocale】入口 - DocID: ${documentId}, Locale: ${locale}`);

  const baseFields = ['title', 'author', 'publishedAt', 'Date', 'slug', 'content', 'documentId'];
  const fieldsParam = `fields=${baseFields.join(',')}`;
  const populateFields = ['image', 'grade', 'programtype', 'Slideshow'];
  const populateQuery = populateFields.map(field => `populate=${field}`).join('&');

  const url = `${strapiConfig.blogPostsEndpoint}?filters[documentId][$eq]=${documentId}&locale=${locale}&${fieldsParam}&${populateQuery}`;
  log(`【fetchBlogByDocumentIdAndLocale】构造的 Strapi 请求 URL: ${url}`);

  try {
    const response = await strapiAxios.get(url);

    log(`【fetchBlogByDocumentIdAndLocale】Strapi 响应状态: ${response.status}`);

    const responseData = response?.data;
    if (responseData?.data && Array.isArray(responseData.data) && responseData.data.length > 0) {
      log(`【fetchBlogByDocumentIdAndLocale】找到博客 ID: ${responseData.data[0].id}`);
      return responseData.data[0];
    } else {
      log(`【fetchBlogByDocumentIdAndLocale】未找到博客。`);
      return null;
    }
  } catch (error) {
    logError(`【fetchBlogByDocumentIdAndLocale】请求失败:`, error);
    throw error;
  }
}

/**
 * 将Strapi数据映射为前端列表格式
 */
function mapStrapiToFrontendListFormat(blog) {
  if (!blog) {
    log(`【mapStrapiToFrontendListFormat】博客数据为空`);
    return null;
  }

  // 检查博客数据结构
  if (!blog.id) {
    log(`【mapStrapiToFrontendListFormat】博客数据缺少 id`);
    return null;
  }

  // 添加调试日志
  log(`【mapStrapiToFrontendListFormat】开始映射博客 ID: ${blog.id}`);
  log(`【mapStrapiToFrontendListFormat】博客数据结构: ${JSON.stringify(Object.keys(blog))}`);

  // 检查是否有 attributes 属性，这是 Strapi v4 的数据结构
  const attrs = blog.attributes || blog;

  // 直接使用博客对象中的字段
  const { id } = blog;
  const title = attrs.title || '';
  const content = attrs.content || '';
  const slug = attrs.slug || '';
  const publishedAt = attrs.publishedAt || null;
  const blogDate = attrs.Date || null;
  const documentId = attrs.documentId || null;
  const author = attrs.author || '';
  const image = attrs.image || null;
  const grade = attrs.grade || null;
  const programtype = attrs.programtype || null;
  const Slideshow = attrs.Slideshow || [];

  // 添加调试日志
  log(`【mapStrapiToFrontendListFormat】提取的字段: title=${title}, slug=${slug}`);

  // 提取图片URL
  let imageUrl = null;
  if (image) {
    // 检查不同的图片数据结构
    if (typeof image === 'string') {
      imageUrl = getFullUrl(image);
    } else if (image.url) {
      imageUrl = getFullUrl(image.url);
    } else if (image.data && image.data.attributes && image.data.attributes.url) {
      imageUrl = getFullUrl(image.data.attributes.url);
    }
    log(`【mapStrapiToFrontendListFormat】提取的图片URL: ${imageUrl}`);
  }

  // 提取幻灯片URL
  let slideshowUrls = [];
  if (Slideshow) {
    if (Array.isArray(Slideshow)) {
      slideshowUrls = Slideshow.map(item => {
        if (typeof item === 'string') return item;
        if (item && item.url) return item.url;
        if (item && item.attributes && item.attributes.url) return item.attributes.url;
        return null;
      }).filter(Boolean);
    } else if (Slideshow.data && Array.isArray(Slideshow.data)) {
      slideshowUrls = Slideshow.data.map(item => {
        if (item && item.attributes && item.attributes.url) return item.attributes.url;
        return null;
      }).filter(Boolean);
    }
    log(`【mapStrapiToFrontendListFormat】提取的幻灯片URL数量: ${slideshowUrls.length}`);
  }

  // 提取年级信息
  let gradeId = null;
  let gradeName = null;
  if (grade) {
    if (typeof grade === 'object') {
      if (grade.data && grade.data.attributes) {
        gradeId = grade.data.id || null;
        gradeName = grade.data.attributes.gradename || null;
      } else {
        gradeId = grade.id || null;
        gradeName = grade.gradename || null;
      }
    }
    log(`【mapStrapiToFrontendListFormat】提取的年级信息: id=${gradeId}, name=${gradeName}`);
  }

  // 提取项目类型信息
  let programTypeId = null;
  let programTypeName = null;
  if (programtype) {
    if (typeof programtype === 'object') {
      if (programtype.data && programtype.data.attributes) {
        programTypeId = programtype.data.id || null;
        programTypeName = programtype.data.attributes.programname || null;
      } else {
        programTypeId = programtype.id || null;
        programTypeName = programtype.programname || null;
      }
    }
    log(`【mapStrapiToFrontendListFormat】提取的项目类型信息: id=${programTypeId}, name=${programTypeName}`);
  }

  // 提取作者名称
  const authorName = author || null;

  // 提取日期
  const date = publishedAt || blogDate || new Date().toISOString();

  // 提取摘要
  const excerpt = content ?
    content.length > 200 ?
      content.substring(0, 200) + '...' :
      content :
    '';

  const mappedItem = {
    id: id || 0,
    title: title,
    excerpt: excerpt,
    image: imageUrl,
    date: date,
    documentId: documentId,
    slug: slug,
    slideshow: slideshowUrls.map(url => ({ url: getFullUrl(url) })),
    grade: gradeId && gradeName ? { id: gradeId, name: gradeName } : null,
    programType: programTypeId && programTypeName ? { id: programTypeId, name: programTypeName } : null,
    authorName: authorName,
  };

  log(`【mapStrapiToFrontendListFormat】完成映射 Blog ID: ${id}, Title: ${title}`);
  return mappedItem;
}

/**
 * 合并博客数据
 */
function mergeBlogData(enBlog, zhBlog) {
  // 如果只有一种语言的数据，直接返回
  if (!enBlog && zhBlog) {
    return mapStrapiBlogToDetailFormat(zhBlog, 'zh');
  }

  if (enBlog && !zhBlog) {
    return mapStrapiBlogToDetailFormat(enBlog, 'en');
  }

  // 合并两种语言的数据
  // 使用英文数据作为基础
  const baseData = mapStrapiBlogToDetailFormat(enBlog, 'en');

  // 添加中文数据
  baseData.title_zh = zhBlog.title;
  baseData.content_zh = zhBlog.content;

  // 添加中文年级和项目类型
  const zhMappedData = mapStrapiBlogToDetailFormat(zhBlog, 'zh');
  baseData.grade_zh = zhMappedData.grade_zh || '';
  baseData.program_type_zh = zhMappedData.program_type_zh || '';

  return baseData;
}

/**
 * 将Strapi博客数据映射为详情格式
 */
function mapStrapiBlogToDetailFormat(blog, locale) {
  if (!blog) {
    log(`【mapStrapiBlogToDetailFormat】博客数据为空`);
    return null;
  }

  // 检查博客数据结构
  if (!blog.id) {
    log(`【mapStrapiBlogToDetailFormat】博客数据缺少 id`);
    return null;
  }

  // 直接使用博客对象中的字段
  const { id } = blog;
  const title = blog.title || '';
  const content = blog.content || '';
  const slug = blog.slug || '';
  const publishedAt = blog.publishedAt || null;
  const blogDate = blog.Date || null;
  const documentId = blog.documentId || null;
  const author = blog.author || '';
  const image = blog.image || null;
  const grade = blog.grade || null;
  const programtype = blog.programtype || null;
  const Slideshow = blog.Slideshow || [];

  // 提取图片URL
  const rawImageUrl = image?.url || (image?.data?.attributes?.url) || null;
  const imageUrl = rawImageUrl ? getFullUrl(rawImageUrl) : null;

  // 提取幻灯片URL
  let slideshowUrls = [];
  if (Array.isArray(Slideshow)) {
    slideshowUrls = Slideshow.map(item => typeof item === 'string' ? item : item.url).filter(Boolean);
  } else if (Slideshow?.data) {
    slideshowUrls = Slideshow.data.map(item => item.attributes?.url).filter(Boolean);
  }

  // 提取年级信息
  const gradeId = grade?.id || null;
  const gradeName = grade?.gradename || null;

  // 提取项目类型信息
  const programTypeId = programtype?.id || null;
  const programTypeName = programtype?.programname || null;

  // 提取作者名称
  const authorName = author || null;

  // 提取日期
  const date = publishedAt || blogDate || new Date().toISOString();

  const mappedItem = {
    id: id || 0,
    documentId: documentId,
    slug: slug,
    date: date,
    coverImage: imageUrl,
    slideshow: slideshowUrls.map(url => ({ url: getFullUrl(url) })),
    grade: gradeId && gradeName ? { id: gradeId, name: gradeName } : null,
    programType: programTypeId && programTypeName ? { id: programTypeId, name: programTypeName } : null,
    author: authorName,
  };

  // 根据语言设置标题、内容、年级和项目类型
  if (locale === 'en') {
    mappedItem.title_en = title;
    mappedItem.content_en = content;
    mappedItem.grade_en = gradeName || '';
    mappedItem.program_type_en = programTypeName || '';
    // 输出调试信息
    log(`【mapStrapiBlogToDetailFormat】英文年级和项目类型: grade_en=${gradeName}, program_type_en=${programTypeName}`);
  } else {
    mappedItem.title_zh = title;
    mappedItem.content_zh = content;
    mappedItem.grade_zh = gradeName || '';
    mappedItem.program_type_zh = programTypeName || '';
    // 输出调试信息
    log(`【mapStrapiBlogToDetailFormat】中文年级和项目类型: grade_zh=${gradeName}, program_type_zh=${programTypeName}`);
  }

  log(`【mapStrapiBlogToDetailFormat】完成映射 Blog ID: ${id}, Title: ${title}`);
  return mappedItem;
}

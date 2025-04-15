import axios from 'axios';
import { strapiConfig } from '../config/strapi.mjs';

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
 * 探索Strapi API结构
 */
export const exploreStrapiApi = async (req, res) => {
  log('【exploreStrapiApi】探索Strapi API结构');

  try {
    // 获取API信息
    const response = await strapiAxios.get('/api');

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logError('【exploreStrapiApi】探索Strapi API结构失败:', error);

    res.status(500).json({
      success: false,
      message: '探索Strapi API结构失败',
      error: error.message
    });
  }
};

/**
 * 获取所有博客文章列表 (兼容旧API)
 */
export const getAllBlogPosts = async (req, res) => {
  const locale = req.query.locale || 'zh';
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  log(`【getAllBlogPosts】获取博客文章列表, locale=${locale}, page=${page}, limit=${limit}`);

  try {
    // 构建Strapi API请求URL
    const baseFields = ['title', 'author', 'publishedAt', 'Date', 'slug', 'content', 'documentId'];
    const fieldsParam = `fields=${baseFields.join(',')}`;
    const populateFields = ['image', 'grade', 'programtype', 'Slideshow'];
    const populateQuery = populateFields.map(field => `populate=${field}`).join('&');

    const url = `${strapiConfig.blogPostsEndpoint}?locale=${locale}&pagination[page]=${page}&pagination[pageSize]=${limit}&${fieldsParam}&${populateQuery}`;

    log(`【getAllBlogPosts】Strapi请求URL: ${url}`);

    // 发送请求到Strapi
    const response = await strapiAxios.get(url);

    if (!response.data || !response.data.data) {
      throw new Error('Strapi API返回无效数据');
    }

    const strapiBlogs = response.data.data;

    // 将Strapi数据映射为旧API格式
    const mappedPosts = strapiBlogs.map(blog => {
      const { id } = blog;
      const title = blog.title || '';
      const content = blog.content || '';
      const slug = blog.slug || '';
      const publishedAt = blog.publishedAt || null;
      const blogDate = blog.Date || null;

      return {
        id,
        title,
        slug,
        content: content ? (Array.isArray(content) ? JSON.stringify(content) : (content.length > 200 ? content.substring(0, 200) + '...' : content)) : '',
        publishedAt: publishedAt || blogDate || new Date().toISOString()
      };
    });

    log(`【getAllBlogPosts】成功映射 ${mappedPosts.length} 篇博客`);

    // 返回旧API格式的响应
    res.json({
      data: mappedPosts,
      success: true
    });
  } catch (error) {
    logError('【getAllBlogPosts】获取博客文章列表失败:', error);

    res.status(500).json({
      success: false,
      message: '获取博客文章列表失败',
      error: error.message
    });
  }
};

/**
 * 根据slug获取单个博客文章 (兼容旧API)
 */
export const getBlogPostBySlug = async (req, res) => {
  const { slug } = req.params;
  const locale = req.query.locale || 'zh';

  log(`【getBlogPostBySlug】获取博客文章, slug=${slug}, locale=${locale}`);

  try {
    // 构建Strapi API请求URL
    const baseFields = ['title', 'author', 'publishedAt', 'Date', 'slug', 'content', 'documentId'];
    const fieldsParam = `fields=${baseFields.join(',')}`;
    const populateFields = ['image', 'grade', 'programtype', 'Slideshow'];
    const populateQuery = populateFields.map(field => `populate=${field}`).join('&');

    const url = `${strapiConfig.blogPostsEndpoint}?filters[slug][$eq]=${slug}&locale=${locale}&${fieldsParam}&${populateQuery}`;

    log(`【getBlogPostBySlug】Strapi请求URL: ${url}`);

    // 发送请求到Strapi
    const response = await strapiAxios.get(url);

    if (!response.data || !response.data.data || !Array.isArray(response.data.data) || response.data.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: `未找到 slug=${slug} 的博客文章`
      });
    }

    const blog = response.data.data[0];
    const { id } = blog;
    const title = blog.title || '';
    const content = blog.content || '';
    const publishedAt = blog.publishedAt || null;
    const blogDate = blog.Date || null;
    const author = blog.author || '';
    const image = blog.image || null;

    // 提取图片URL
    const imageUrl = image?.url || (image?.data?.attributes?.url) || null;

    // 返回旧API格式的响应
    res.json({
      data: {
        id,
        title,
        slug,
        content,
        publishedAt: publishedAt || blogDate || new Date().toISOString(),
        author: author || 'Unknown',
        image: imageUrl
      },
      success: true
    });
  } catch (error) {
    logError(`【getBlogPostBySlug】获取博客文章失败, slug=${slug}:`, error);

    res.status(500).json({
      success: false,
      message: `获取博客文章失败, slug=${slug}`,
      error: error.message
    });
  }
};

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
 * 获取博客视频列表
 */
export const getAllBlogVideos = async (req, res) => {
  const locale = req.query.locale || 'zh';
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 2;

  log(`【请求处理 /blog-videos】Locale=${locale}, Page=${page}, Limit=${limit}`);

  try {
    // 构建Strapi API请求URL
    const baseFields = ['title', 'videolink'];
    const fieldsParam = `fields=${baseFields.join(',')}`;
    const populateFields = ['videos', 'image'];
    const populateQuery = populateFields.map(field => `populate=${field}`).join('&');

    const url = `${strapiConfig.apiUrl}/api/blogvideos?locale=${locale}&pagination[page]=${page}&pagination[pageSize]=${limit}&${populateQuery}`;

    log(`【getAllBlogVideos】Strapi请求URL: ${url}`);

    // 发送请求到Strapi
    const response = await strapiAxios.get(url);

    if (!response.data || !response.data.data) {
      throw new Error('Strapi API返回无效数据');
    }

    // 提取分页信息
    const pagination = response.data.meta?.pagination || { page: 1, pageSize: limit, pageCount: 1, total: 0 };
    const { pageCount, total } = pagination;

    // 映射视频数据
    const videos = response.data.data.map(item => mapStrapiBlogVideoToFrontendFormat(item, locale));

    log(`【getAllBlogVideos】Strapi返回 ${videos.length} 个视频。总页数: ${pageCount}, 总视频数: ${total}`);

    // 返回响应
    return res.json({
      videos,
      totalVideos: total,
      totalPages: pageCount,
      currentPage: page
    });
  } catch (error) {
    logError('【getAllBlogVideos】获取博客视频列表失败', error);

    // 如果是Strapi API错误，返回更详细的错误信息
    if (error.response) {
      return res.status(error.response.status).json({
        error: '获取博客视频列表失败',
        details: error.response.data
      });
    }

    return res.status(500).json({ error: '获取博客视频列表失败', message: error.message });
  }
};

/**
 * 通过slug获取博客视频
 */
export const getBlogVideoBySlug = async (req, res) => {
  const { slug } = req.params;
  const locale = req.query.locale || 'zh';

  log(`【请求处理 /blog-videos/:slug】请求的 slug=${slug}`);

  try {
    // 构建Strapi API请求URL
    const baseFields = ['title', 'videolink'];
    const fieldsParam = `fields=${baseFields.join(',')}`;
    const populateFields = ['videos', 'image'];
    const populateQuery = populateFields.map(field => `populate=${field}`).join('&');

    // 由于没有slug字段，我们使用ID查询
    // 从 slug 中提取ID，格式为 video-{id}
    const idMatch = slug.match(/video-(\d+)/);
    let url;

    if (idMatch && idMatch[1]) {
      const id = idMatch[1];
      url = `${strapiConfig.apiUrl}/api/blogvideos/${id}?locale=${locale}&${populateQuery}`;
    } else {
      // 如果不是我们生成的slug格式，尝试直接使用slug查询
      url = `${strapiConfig.apiUrl}/api/blogvideos?filters[id][$eq]=${slug}&locale=${locale}&${populateQuery}`;
    }

    log(`【getBlogVideoBySlug】Strapi请求URL: ${url}`);

    // 发送请求到Strapi
    const response = await strapiAxios.get(url);

    // 处理不同的响应格式
    let videoData;

    if (idMatch && idMatch[1]) {
      // 如果是直接根据ID查询，响应格式不同
      if (!response.data || !response.data.data) {
        return res.status(404).json({ error: '未找到博客视频' });
      }
      videoData = response.data.data;
    } else {
      // 如果是使用过滤器查询
      if (!response.data || !response.data.data || response.data.data.length === 0) {
        return res.status(404).json({ error: '未找到博客视频' });
      }
      videoData = response.data.data[0];
    }

    // 映射视频数据
    const video = mapStrapiBlogVideoToFrontendFormat(videoData, locale);

    log(`【getBlogVideoBySlug】成功获取 slug=${slug} 的视频`);

    // 返回响应
    return res.json({ video });
  } catch (error) {
    logError(`【getBlogVideoBySlug】获取博客视频失败: ${slug}`, error);

    // 如果是Strapi API错误，返回更详细的错误信息
    if (error.response) {
      return res.status(error.response.status).json({
        error: '获取博客视频失败',
        details: error.response.data
      });
    }

    return res.status(500).json({ error: '获取博客视频失败', message: error.message });
  }
};

/**
 * 将Strapi博客视频数据映射为前端格式
 */
function mapStrapiBlogVideoToFrontendFormat(item, locale) {
  if (!item) {
    log('【mapStrapiBlogVideoToFrontendFormat】无效的视频数据');
    return null;
  }

  const { id } = item;
  const {
    title,
    videolink,
    publishedAt
  } = item;

  // 提取缩略图URL
  let thumbnailUrl = '';
  const image = item.image;
  if (image) {
    thumbnailUrl = getFullUrl(image.url);
  }

  // 提取视频URL
  let videoUrl = '';
  let youtubeUrl = videolink || '';
  const videos = item.videos;
  if (videos && Array.isArray(videos) && videos.length > 0) {
    videoUrl = getFullUrl(videos[0].url);
  }

  // 构建前端格式的视频对象
  const mappedVideo = {
    id,
    title_en: locale === 'en' ? title : '',
    title_zh: locale === 'zh' ? title : '',
    description_en: locale === 'en' ? title : '', // 没有description字段，暂时使用title
    description_zh: locale === 'zh' ? title : '', // 没有description字段，暂时使用title
    publishedAt: publishedAt || new Date().toISOString(),
    slug: `video-${id}`, // 没有slug字段，使用id生成
    thumbnail: thumbnailUrl,
    file_url: videoUrl,
    youtube_url: youtubeUrl,
    category: null // 没有category字段
  };

  log(`【mapStrapiBlogVideoToFrontendFormat】完成映射 Video ID: ${id}, Title: ${title}`);
  return mappedVideo;
}

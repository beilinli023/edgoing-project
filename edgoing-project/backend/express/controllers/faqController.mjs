import axios from 'axios';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 获取Strapi配置
const strapiConfig = {
  apiUrl: process.env.STRAPI_URL || 'http://localhost:1337',
  token: process.env.STRAPI_TOKEN || ''
};

// 创建Axios实例
const strapiAxios = axios.create({
  baseURL: strapiConfig.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': strapiConfig.token ? `Bearer ${strapiConfig.token}` : ''
  }
});

// 日志函数
const log = (message) => {
  console.log(`[FAQ Controller] ${message}`);
};

// 将Strapi FAQ映射到前端格式
function mapStrapiFaqToFrontendFormat(item, locale) {
  if (!item) {
    log(`无效的FAQ数据: ${JSON.stringify(item)}`);
    return null;
  }

  const { id, question, answer, documentId } = item;

  // 构建前端格式的FAQ对象
  return {
    id,
    question: question,
    answer: answer,
    documentId: documentId,
    category_id: 1, // 默认分类ID
    order: id,
    is_featured: true
  };
}

// 获取所有FAQ
export const getAllFaqs = async (req, res) => {
  const locale = req.query.locale || 'en';
  const otherLocale = locale === 'en' ? 'zh' : 'en';

  try {
    log(`获取所有FAQ，主语言: ${locale}, 副语言: ${otherLocale}`);

    // 构建Strapi API请求URL - 主语言
    const primaryUrl = `${strapiConfig.apiUrl}/api/faqs?locale=${locale}&sort=id:asc`;

    // 发送请求到Strapi - 主语言
    const primaryResponse = await strapiAxios.get(primaryUrl);

    if (!primaryResponse.data || !primaryResponse.data.data || !Array.isArray(primaryResponse.data.data)) {
      log('Strapi返回的主语言FAQ数据无效');
      return res.status(404).json({ error: '未找到FAQ数据' });
    }

    // 构建Strapi API请求URL - 副语言
    const secondaryUrl = `${strapiConfig.apiUrl}/api/faqs?locale=${otherLocale}&sort=id:asc`;

    // 发送请求到Strapi - 副语言
    const secondaryResponse = await strapiAxios.get(secondaryUrl);

    // 创建一个映射，以documentId为键，存储副语言的FAQ数据
    const secondaryFaqsMap = {};
    if (secondaryResponse.data && secondaryResponse.data.data && Array.isArray(secondaryResponse.data.data)) {
      secondaryResponse.data.data.forEach(item => {
        if (item && item.documentId) {
          secondaryFaqsMap[item.documentId] = item;
        }
      });
    }

    // 映射数据，合并两种语言的FAQ数据
    log(`Strapi返回的主语言FAQ数据: ${JSON.stringify(primaryResponse.data)}`);

    const faqs = primaryResponse.data.data.map(primaryItem => {
      // 查找对应的副语言FAQ数据
      const secondaryItem = primaryItem.documentId ? secondaryFaqsMap[primaryItem.documentId] : null;

      // 构建前端格式的FAQ对象
      return {
        id: primaryItem.id,
        question_en: locale === 'en' ? primaryItem.question : (secondaryItem ? secondaryItem.question : ''),
        question_zh: locale === 'zh' ? primaryItem.question : (secondaryItem ? secondaryItem.question : ''),
        answer_en: locale === 'en' ? primaryItem.answer : (secondaryItem ? secondaryItem.answer : ''),
        answer_zh: locale === 'zh' ? primaryItem.answer : (secondaryItem ? secondaryItem.answer : ''),
        category_id: 1, // 默认分类ID
        order: primaryItem.id,
        is_featured: true,
        documentId: primaryItem.documentId
      };
    });

    log(`成功获取${faqs.length}个FAQ，已合并两种语言的数据`);

    return res.json(faqs.filter(Boolean));
  } catch (error) {
    log(`获取FAQ失败: ${error.message}`);
    return res.status(500).json({ error: '获取FAQ失败', details: error.message });
  }
};

// 搜索FAQ
export const searchFaqs = async (req, res) => {
  const locale = req.query.locale || 'en';
  const otherLocale = locale === 'en' ? 'zh' : 'en';
  const query = req.query.q || '';

  if (!query.trim()) {
    // 如果搜索查询为空，返回所有FAQ
    return getAllFaqs(req, res);
  }

  try {
    log(`搜索FAQ，查询: "${query}"，主语言: ${locale}, 副语言: ${otherLocale}`);

    // 构建Strapi API请求URL - 主语言
    const primaryUrl = `${strapiConfig.apiUrl}/api/faqs?locale=${locale}&filters[question][$containsi]=${encodeURIComponent(query)}`;

    // 发送请求到Strapi - 主语言
    const primaryResponse = await strapiAxios.get(primaryUrl);

    if (!primaryResponse.data || !primaryResponse.data.data) {
      log('Strapi返回的主语言搜索结果无效');
      return res.json([]);
    }

    // 构建Strapi API请求URL - 副语言
    const secondaryUrl = `${strapiConfig.apiUrl}/api/faqs?locale=${otherLocale}`;

    // 发送请求到Strapi - 副语言
    const secondaryResponse = await strapiAxios.get(secondaryUrl);

    // 创建一个映射，以documentId为键，存储副语言的FAQ数据
    const secondaryFaqsMap = {};
    if (secondaryResponse.data && secondaryResponse.data.data && Array.isArray(secondaryResponse.data.data)) {
      secondaryResponse.data.data.forEach(item => {
        if (item && item.documentId) {
          secondaryFaqsMap[item.documentId] = item;
        }
      });
    }

    // 映射数据，合并两种语言的FAQ数据
    const faqs = primaryResponse.data.data.map(primaryItem => {
      // 查找对应的副语言FAQ数据
      const secondaryItem = primaryItem.documentId ? secondaryFaqsMap[primaryItem.documentId] : null;

      // 构建前端格式的FAQ对象
      return {
        id: primaryItem.id,
        question_en: locale === 'en' ? primaryItem.question : (secondaryItem ? secondaryItem.question : ''),
        question_zh: locale === 'zh' ? primaryItem.question : (secondaryItem ? secondaryItem.question : ''),
        answer_en: locale === 'en' ? primaryItem.answer : (secondaryItem ? secondaryItem.answer : ''),
        answer_zh: locale === 'zh' ? primaryItem.answer : (secondaryItem ? secondaryItem.answer : ''),
        category_id: 1, // 默认分类ID
        order: primaryItem.id,
        is_featured: true,
        documentId: primaryItem.documentId
      };
    });

    log(`搜索结果: ${faqs.length}个FAQ，已合并两种语言的数据`);

    return res.json(faqs.filter(Boolean));
  } catch (error) {
    log(`搜索FAQ失败: ${error.message}`);
    return res.status(500).json({ error: '搜索FAQ失败', details: error.message });
  }
};

// 获取单个FAQ
export const getFaqById = async (req, res) => {
  const { id } = req.params;
  const locale = req.query.locale || 'en';
  const otherLocale = locale === 'en' ? 'zh' : 'en';

  try {
    log(`获取FAQ ID: ${id}，主语言: ${locale}, 副语言: ${otherLocale}`);

    // 构建Strapi API请求URL - 主语言
    const primaryUrl = `${strapiConfig.apiUrl}/api/faqs/${id}?locale=${locale}`;

    // 发送请求到Strapi - 主语言
    const primaryResponse = await strapiAxios.get(primaryUrl);

    if (!primaryResponse.data || !primaryResponse.data.data) {
      log(`未找到ID为${id}的FAQ`);
      return res.status(404).json({ error: '未找到FAQ' });
    }

    const primaryItem = primaryResponse.data.data;

    // 如果有documentId，尝试获取副语言的FAQ数据
    let secondaryItem = null;
    if (primaryItem.documentId) {
      try {
        // 构建Strapi API请求URL - 副语言，根据documentId查询
        const secondaryUrl = `${strapiConfig.apiUrl}/api/faqs?locale=${otherLocale}&filters[documentId][$eq]=${primaryItem.documentId}`;

        // 发送请求到Strapi - 副语言
        const secondaryResponse = await strapiAxios.get(secondaryUrl);

        if (secondaryResponse.data && secondaryResponse.data.data && Array.isArray(secondaryResponse.data.data) && secondaryResponse.data.data.length > 0) {
          secondaryItem = secondaryResponse.data.data[0];
        }
      } catch (error) {
        log(`获取副语言FAQ失败: ${error.message}`);
        // 如果获取副语言失败，不影响主语言的返回
      }
    }

    // 构建前端格式的FAQ对象
    const faq = {
      id: primaryItem.id,
      question_en: locale === 'en' ? primaryItem.question : (secondaryItem ? secondaryItem.question : ''),
      question_zh: locale === 'zh' ? primaryItem.question : (secondaryItem ? secondaryItem.question : ''),
      answer_en: locale === 'en' ? primaryItem.answer : (secondaryItem ? secondaryItem.answer : ''),
      answer_zh: locale === 'zh' ? primaryItem.answer : (secondaryItem ? secondaryItem.answer : ''),
      category_id: 1, // 默认分类ID
      order: primaryItem.id,
      is_featured: true,
      documentId: primaryItem.documentId
    };

    if (!faq) {
      return res.status(404).json({ error: '未找到FAQ' });
    }

    return res.json(faq);
  } catch (error) {
    log(`获取FAQ失败: ${error.message}`);
    return res.status(500).json({ error: '获取FAQ失败', details: error.message });
  }
};

export default {
  getAllFaqs,
  searchFaqs,
  getFaqById
};

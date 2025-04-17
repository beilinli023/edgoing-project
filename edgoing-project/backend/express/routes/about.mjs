import express from 'express';
import { fetchFromStrapi } from '../utils/strapiConnector.mjs';

const router = express.Router();

/**
 * 获取关于页面Hero数据
 * GET /api/about/hero
 */
router.get('/hero', async (req, res) => {
  try {
    const locale = req.query.locale || 'en';
    console.log(`获取关于页面Hero数据，语言: ${locale}`);

    // 从Strapi获取数据
    const response = await fetchFromStrapi(`/api/aboutheroes?populate=*&locale=${locale}`);
    
    if (!response.data || response.data.length === 0) {
      console.log('没有找到关于页面Hero数据');
      return res.status(404).json({
        success: false,
        message: locale === 'zh' ? '没有找到关于页面Hero数据' : 'About hero data not found',
        source: 'strapi'
      });
    }

    // 获取第一个结果
    const heroData = response.data[0];
    
    // 构建返回数据
    const result = {
      id: heroData.id,
      title: heroData.title,
      subtitle: heroData.subtitle,
      imageUrl: heroData.image ? `${process.env.STRAPI_URL || 'http://localhost:1337'}${heroData.image.url}` : null
    };

    console.log('成功获取关于页面Hero数据');
    return res.json({
      success: true,
      data: result,
      source: 'strapi'
    });
  } catch (error) {
    console.error('获取关于页面Hero数据出错:', error);
    return res.status(500).json({
      success: false,
      message: '获取关于页面Hero数据时发生错误',
      error: error.message,
      source: 'strapi'
    });
  }
});

export default router;

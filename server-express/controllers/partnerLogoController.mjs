import axios from 'axios';
import { strapiConfig } from '../config/strapi.mjs';

/**
 * 获取合作伙伴Logo列表
 *
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
export const getPartnerLogos = async (req, res) => {
  try {
    const language = req.query.language || 'en';

    // 构建Strapi API请求URL
    const url = `${strapiConfig.apiUrl}/api/partner-logos`;

    // 设置查询参数
    const params = {
      locale: language,
      populate: '*',
      sort: 'order:asc',
    };

    console.log(`请求Strapi API: ${url}`);
    console.log('Query params:', params);

    // 准备请求头部
    const headers = {
      Authorization: `Bearer ${strapiConfig.apiToken}`
    };

    console.log('使用API令牌:', strapiConfig.apiToken ? '是' : '否');

    // 发送请求到Strapi API
    const response = await axios.get(url, { params, headers });

    // 处理响应数据
    console.log('Strapi API响应:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.data) {
      console.log(`找到${response.data.data.length}个合作伙伴Logo`);

      // 转换数据格式
      const logos = response.data.data.map(item => {
        const { id, attributes, name, order, image } = item;
        console.log(`处理Logo ID: ${id}, 名称: ${name}`);

        // 构建图片URL
        let imageUrl = '';

        // 直接使用image字段
        if (image && image.url) {
          imageUrl = `${strapiConfig.apiUrl}${image.url}`;
        }

        const result = {
          id,
          name: name,
          image_url: imageUrl,
          website_url: '',
          description: '',
          order: order || 0
        };

        console.log(`处理后的Logo数据:`, result);
        return result;
      });

      res.json(logos);
    } else {
      // 如果没有数据，返回空数组
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching partner logos:', error);
    res.status(500).json({
      error: 'Failed to fetch partner logos',
      message: error.message
    });
  }
};

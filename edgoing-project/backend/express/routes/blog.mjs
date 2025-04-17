import express from 'express';
import { 
  getAllBlogs, 
  getBlogBySlug, 
  testStrapiConnection, 
  getRawStrapiResponse, 
  getRawStrapiData 
} from '../controllers/blogController.mjs';

const router = express.Router();

// 简单的ping测试端点
router.get('/ping', (req, res) => {
  res.json({ message: 'pong', timestamp: new Date().toISOString() });
});

// 获取博客文章列表
router.get('/', getAllBlogs);

// 测试Strapi连接
router.get('/test-strapi', testStrapiConnection);

// 获取原始Strapi响应
router.get('/raw-strapi', getRawStrapiResponse);

// 获取原始Strapi数据
router.get('/raw-strapi-data', getRawStrapiData);

// 根据slug获取单个博客文章
router.get('/:slug', getBlogBySlug);

export default router;

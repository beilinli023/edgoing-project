import express from 'express';
import { 
  createContent, 
  getAllContents, 
  getContentById, 
  getContentBySlug,
  searchContents 
} from '../controllers/contents/index.mjs';

const router = express.Router();

// 内容搜索 - 使用特定路径确保不会被其他路由拦截
router.get('/api-search', searchContents);

// 获取所有内容项（支持分页、筛选和排序）
router.get('/', getAllContents);

// 根据ID获取内容
router.get('/:id([0-9]+)', getContentById);

// 根据slug获取内容
router.get('/:slug', getContentBySlug);

// 创建新内容
router.post('/', createContent);

export default router;

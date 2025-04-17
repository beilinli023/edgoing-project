import express from 'express';
import { 
  getAllBlogVideos, 
  getBlogVideoBySlug 
} from '../controllers/blogVideoController.mjs';

const router = express.Router();

// 获取博客视频列表
router.get('/', getAllBlogVideos);

// 根据slug获取单个博客视频
router.get('/:slug', getBlogVideoBySlug);

export default router;

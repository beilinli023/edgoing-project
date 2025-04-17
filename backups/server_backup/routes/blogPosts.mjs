import express from 'express';
import { getAllBlogPosts, getBlogPostBySlug, exploreStrapiApi } from '../controllers/blogPostsController.mjs';

const router = express.Router();

// 探索Strapi API结构
router.get('/explore-api', exploreStrapiApi);

// 获取所有博客文章列表
router.get('/', getAllBlogPosts);

// 根据slug获取单个博客文章
router.get('/:slug', getBlogPostBySlug);

export default router; 
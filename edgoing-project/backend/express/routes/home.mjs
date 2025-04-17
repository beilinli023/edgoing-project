import express from 'express';
import { getHomeCarousel, getTaglineSection, getHomeHero } from '../controllers/homeController.mjs';

const router = express.Router();

/**
 * @route GET /api/home/carousel
 * @desc 获取首页轮播图数据
 * @access Public
 */
router.get('/carousel', getHomeCarousel);

/**
 * @route GET /api/home/tagline
 * @desc 获取首页标语部分数据
 * @access Public
 */
router.get('/tagline', getTaglineSection);

/**
 * @route GET /api/home/hero
 * @desc 获取首页Hero数据
 * @access Public
 */
router.get('/hero', getHomeHero);

export default router;

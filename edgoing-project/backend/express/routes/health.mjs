import express from 'express';
import { checkHealth, checkStrapiHealth } from '../controllers/healthController.mjs';

const router = express.Router();

// 基本健康检查
router.get('/', checkHealth);

// Strapi健康检查
router.get('/strapi', checkStrapiHealth);

export default router;

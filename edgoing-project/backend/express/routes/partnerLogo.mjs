import express from 'express';
import { getPartnerLogos } from '../controllers/partnerLogoController.mjs';

const router = express.Router();

/**
 * @route GET /api/partner-logos
 * @desc 获取合作伙伴Logo列表
 * @access Public
 */
router.get('/', getPartnerLogos);

export default router;

import express from 'express';
import { getAllFaqs, searchFaqs, getFaqById } from '../controllers/faqController.mjs';

const router = express.Router();

// 获取所有FAQ
router.get('/', getAllFaqs);

// 搜索FAQ
router.get('/search', searchFaqs);

// 获取单个FAQ
router.get('/:id', getFaqById);

export default router;

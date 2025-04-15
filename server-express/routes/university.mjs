import express from 'express';
import { getAllUniversities, getUniversityById, getStudyAbroadContent } from '../controllers/universityController.mjs';

const router = express.Router();

// 获取留学页面内容（包括大学列表）
router.get('/study-abroad/content', getStudyAbroadContent);

// 获取所有大学列表
router.get('/', getAllUniversities);

// 获取特定大学的详细信息
router.get('/:id', getUniversityById);

export default router;

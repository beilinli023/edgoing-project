import express from 'express';
import { getAllPrograms, getProgramById, getProgramFilters, getProgramHero } from '../controllers/programController.mjs';

const router = express.Router();

// 获取项目页面Hero数据
router.get('/hero', getProgramHero);

// 获取项目筛选选项
router.get('/filters', getProgramFilters);

// 获取项目列表
router.get('/', getAllPrograms);

// 获取单个项目详情
router.get('/:id', getProgramById);

export default router;

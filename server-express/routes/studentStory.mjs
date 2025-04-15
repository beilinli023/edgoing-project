import express from 'express';
import { getAllStudentStories, getStudentStoryById } from '../controllers/studentStoryController.mjs';

const router = express.Router();

// 获取所有学生故事
router.get('/', getAllStudentStories);

// 获取特定ID的学生故事
router.get('/:id', getStudentStoryById);

export default router;

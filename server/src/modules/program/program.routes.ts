import { Router } from 'express';
import * as programController from './program.controller';

const router = Router();

// 项目相关路由
router.get('/programs', programController.getPrograms);
router.get('/programs/:id', programController.getProgramById);
router.get('/program-filters', programController.getProgramFilters);

export default router;

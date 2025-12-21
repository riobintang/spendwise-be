import { Router } from 'express';
import * as summaryController from './summary.controller';

const router = Router();

router.get('/', summaryController.getSummary);

export default router;

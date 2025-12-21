import { Router } from 'express';
import * as transactionController from './transaction.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, transactionController.listTransactions);
router.post('/', authMiddleware, transactionController.createTransaction);
router.put('/:id', authMiddleware, transactionController.updateTransaction);
router.delete('/:id', authMiddleware, transactionController.deleteTransaction);

export default router;

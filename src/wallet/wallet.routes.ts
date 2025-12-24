import { Router } from 'express';
import * as walletController from './wallet.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, walletController.listWallets);
router.post('/', authMiddleware, walletController.createWallet);
router.put('/:id', authMiddleware, walletController.updateWallet);
router.delete('/:id', authMiddleware, walletController.deleteWallet);

export default router;

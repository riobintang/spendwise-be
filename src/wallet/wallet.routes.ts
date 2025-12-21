import { Router } from 'express';
import * as walletController from './wallet.controller';

const router = Router();

router.get('/', walletController.listWallets);
router.post('/', walletController.createWallet);
router.put('/:id', walletController.updateWallet);
router.delete('/:id', walletController.deleteWallet);

export default router;

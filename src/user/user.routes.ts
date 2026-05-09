import { Router } from 'express';
import * as userController from './user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../utils/s3/multer-config';

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/profile/photo', authMiddleware, upload.single('image'), userController.updateProfilePhoto);
router.delete('/profile/photo', authMiddleware, userController.deleteProfilePhoto);
router.put('/profile', authMiddleware, userController.updateProfile);
router.put('/password', authMiddleware, userController.changePassword);

export default router;

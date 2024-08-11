import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import {
  getUserByIdController,
  updateAvatarController,
  updateUserController,
} from '../controllers/user.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import isValid from '../middlewares/isValid.js';
import { upload } from '../middlewares/multer.js';
import { updateUserSchema } from '../validation/user.js';
import { countUserController } from '../controllers/user.js';

const router = Router();
router.get('/count', ctrlWrapper(countUserController));
router.use(authenticate);
router.get('/', isValid, ctrlWrapper(getUserByIdController));
router.patch(
  '/update',
  validateBody(updateUserSchema),
  ctrlWrapper(updateUserController),
);
router.post(
  '/avatar',
  upload.single('avatar'),
  ctrlWrapper(updateAvatarController),
);
export default router;

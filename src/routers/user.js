import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import {
  getUserByIdController,
  updateUserController,
} from '../controllers/user.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import isValid from '../middlewares/isValid.js';
import { upload } from '../middlewares/multer.js';
import { updateUserSchema } from '../validation/user.js';

const router = Router();
router.use(authenticate);
router.get('/:id', isValid, ctrlWrapper(getUserByIdController));
router.patch(
  '/:id',
  upload.single('avatar'),
  validateBody(updateUserSchema),
  ctrlWrapper(updateUserController),
);
export default router;

import { Router } from "express";
import { addWaterController, deleteWaterController, patchWaterController } from "../controllers/water.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { addWaterSchema } from "../validation/water.js";
import isValid from "../middlewares/isValid.js";


const router = Router();

router.get('/:userId', isValid, ctrlWrapper())

router.post('/', validateBody(addWaterSchema), ctrlWrapper(addWaterController));
router.patch('/:userId', ctrlWrapper(patchWaterController));
router.delete('/:userId', ctrlWrapper(deleteWaterController));

export default router;
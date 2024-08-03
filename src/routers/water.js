import { Router } from "express";
import { addWaterController, deleteWaterController, getWaterConsumptionController, patchWaterController } from "../controllers/water.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { addWaterSchema } from "../validation/water.js";
import { authenticate } from "../middlewares/authenticate.js";


const router = Router();

router.use(authenticate);

router.post('/', validateBody(addWaterSchema), ctrlWrapper(addWaterController));
router.patch('/:waterId', ctrlWrapper(patchWaterController));
router.delete('/:waterId', ctrlWrapper(deleteWaterController));
router.get('/consumption', ctrlWrapper(getWaterConsumptionController));

export default router;

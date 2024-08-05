import { Router } from "express";
import { addWaterController, deleteWaterController, getMonthWaterController, getWaterConsumptionController, patchWaterController } from "../controllers/water.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { addWaterSchema } from "../validation/water.js";
import { authenticate } from "../middlewares/authenticate.js";
import isValidateMonth from "../middlewares/isValidateMonth.js";
import isValidateDay from "../middlewares/isValidateDay.js";


const router = Router();

router.use(authenticate);

router.post('/', validateBody(addWaterSchema), ctrlWrapper(addWaterController));
router.patch('/:waterId', ctrlWrapper(patchWaterController));
router.delete('/:waterId', ctrlWrapper(deleteWaterController));
router.get('/day/:date', isValidateDay, ctrlWrapper(getWaterConsumptionController));
router.get('/month/:date', isValidateMonth, ctrlWrapper(getMonthWaterController));


export default router;

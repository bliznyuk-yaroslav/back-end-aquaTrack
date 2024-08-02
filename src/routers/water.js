import { Router } from "express";
import { addWaterController } from "../controllers/water.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router();

router.post('/water', ctrlWrapper(addWaterController));

export default router;
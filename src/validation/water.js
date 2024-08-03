import Joi from 'joi';

export const addWaterSchema = Joi.object({
    amountOfWater: Joi.number().required(),
    time: Joi.string(),
    dailyNorma: Joi.number(),
    monthWater: Joi.number(),
    totalAmount: Joi.number()
});

export const patchWaterSchema = Joi.object({
    amountOfWater: Joi.number(),
    time: Joi.string(),
    dailyNorma: Joi.number(),
    monthWater: Joi.number(),
    totalAmount: Joi.number()
});

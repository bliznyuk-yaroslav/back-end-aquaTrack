import Joi from 'joi';

export const addWaterSchema = Joi.object({
    amountOfWater: Joi.number().required(),
    dailyNorma: Joi.number(),
    totalAmount: Joi.number(),
});

export const patchWaterSchema = Joi.object({
    amountOfWater: Joi.number(),
    dailyNorma: Joi.number(),
    totalAmount: Joi.number(),
});
import { addWater, deleteWater, getMonthWater, getWaterById, patchWater } from "../services/water.js";
import createHttpError from "http-errors";

export const getWaterByIdController = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        const { waterId } = req.params;

        const water = await getWaterById({_id: waterId, userId });
        if (!water) {
            return next(createHttpError(404, "Water amount not found..."));
        }
        res.status(200).json({
            status: 200,
            data: water,
            message: `Successfully found amount of water for id ${userId}!`,
        });
    } catch (error) {
        next(error);
    }
};

export const addWaterController = async (req, res, next) => {
    const { _id: userId } = req.user;
    try {
        const waterData = { ...req.body, userId };
        const water = await addWater(waterData);
         res.status(201).json({
        status: 201,
        message: 'Succesfully add water amount!',
        data: water,
    });
    } catch (error) {
        next(error);
    }
};

export const patchWaterController = async (req, res, next) => {
    const { _id: userId } = req.user;
    const { waterId } = req.params;

    try {
        const result = await patchWater({ _id: waterId, userId }, req.body);
        if (!result) {
            next(createHttpError(404, 'Water amount not found!'));
            return next(error);
        }
        res.json({
            status: 200,
            message: 'Successfully patched amount of water!',
            data: result.water,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteWaterController = async (req, res, next) => {
    const { userId } = req.params;

    const water = await deleteWater(userId);

    if (!water) {
        next(createHttpError(404, 'No amout of water found'));
        return;
    }
    res.status(204).send();
};

export const getMonthWaterController = async (req, res, next) => {
    try {
    
    const { _id: userId } = req.user;
    const { date } = req.params;

    if (!date) {
    return res.status(400).json({message: "Date is required!"})
    }
    
    const waterMonth = await getMonthWater(userId, date);

    res.status(200).json({
        status: 200,
        message: 'Successfully found amount of water for this month!',
        data: waterMonth
    })
    } catch (error) {
        next(error);
    }
};



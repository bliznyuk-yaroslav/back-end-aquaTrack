import { addWater, deleteWater, getWaterById, patchWater } from "../services/water.js";
import createHttpError from "http-errors";

export const getWaterByIdController = async (req, res, next) => {
    try { 
        const { _id: userId } = req.user;
        const { userId } = req.params;

        const water = await getWaterById(userId);
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
}

export const addWaterController = async (req, res) => {
    const water = await addWater(req.body);
    
    res.status(201).json({
        status: 201,
        message: 'Succesfully add water amount!',
        data: water,
    });
};

export const patchWaterController = async (req, res, next) => {
    const { userId } = req.params;
    const result = await patchWater(userId, req.body);

    if (!result) {
        next(createHttpError(404, 'Water amount not found!'));
        return;
    }
    res.json({
        status: 200,
        message: 'Successfully patched amount of water!',
        data: result.water,
    });
};

export const deleteWaterController = async (req, res) => {
    const { userId } = req.params;
    const water = await deleteWater(userId);

    if (!water) {
        next(createHttpError(404, 'No amount of water'));
        return;
    }
    res.status(204).send();
};
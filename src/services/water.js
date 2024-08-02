import { WaterCollection } from "../db/models/water.js";

export const getWaterById = async (userId) => {
    const water = await WaterCollection.findOne({ _id: userId, userId });
    return water;
};


export const addWater = async (payload) => {
    const water = await WaterCollection.create(payload);
    return water;
};

export const patchWater = async (filter, payload, options = {}) => {
    const rawResult = await WaterCollection.findOneAndUpdate(
        filter,
        payload,
        {
            new: true,
            includeResultMetadata: true,
            ...options,
        },
    );
    if (!rawResult || !rawResult.value) return null;
    return {
        water: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    };
};

export const deleteWater = async (userId) => {
    const water = await WaterCollection.findOneAndDelete({
        _id: userId,
    });
    return water;
};
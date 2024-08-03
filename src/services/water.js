import { WaterCollection } from "../db/models/water.js";

export const getWaterById = async (waterId, userId) => {
    const water = await WaterCollection.findOne({ _id: waterId, userId });
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

export const deleteWater = async (waterId) => {
    const water = await WaterCollection.findOneAndDelete({
    waterId,
    });
    return water;
};

export const getMonthWater = async (userId, date) => {
    const startDate = new Date(date);
    const endDate = new Date(date);
    
    endDate.setMonth(startDate.getMonth() + 1);
    endDate.setDate(0);

    const waterMonth = await WaterCollection.find({
        userId: userId,
        createdAt: {
            $gte: startDate,
            $lte: endDate
        }
    });

    if (waterMonth.length === 0) {
        return {
            waterMonth: [],
            totalAmount: 0,
            percentageConsumed: "0%",
        };
    }

    const totalAmount = waterMonth.reduce((sum, record) => sum + record.amountOfWater, 0);
    const monthWater = waterMonth[0].monthWater * 1000;
    const percentageConsumed = ((totalAmount / monthWater) * 100).toFixed(2) + "%";

    return {
        waterMonth,
        totalAmount,
        percentageConsumed
    };
};
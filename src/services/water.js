import { WaterCollection } from "../db/models/water.js";

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

export const getWaterConsumptionByDate = async (userId, date) => {
  const startDate = new Date(date);
  const endDate = new Date(date);
  endDate.setDate(startDate.getDate() + 1);

  const waterData = await WaterCollection.find({
    userId: userId,
    createdAt: {
      $gte: startDate,
      $lt: endDate
    }
  });

  if (waterData.length === 0) {
    return {
      waterData: [],
      totalAmount: 0,
      percentageConsumed: "0%",
    };
  }

  const totalAmount = waterData.reduce((total, record) => total + record.amountOfWater, 0);
  const dailyNorma = waterData[0].dailyNorma * 1000;
  const percentageConsumed = ((totalAmount / dailyNorma) * 100).toFixed(2) + "%";

  return {
    waterData,
    totalAmount,
    percentageConsumed
  };
};



export const getMonthWater = async (userId, date) => {
  const [year, month] = date.split("-");
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  const waterMonth = await WaterCollection.find({
    userId: userId,
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  });

  const totalMonthlyWater = waterMonth.reduce((sum, entry) => sum + (entry.amountOfWater || 0), 0);

  return {
totalMonthlyWater,
  };
  
};


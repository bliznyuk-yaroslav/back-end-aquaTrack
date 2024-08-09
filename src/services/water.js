import { WaterCollection } from "../db/models/water.js";
import { UsersCollection } from "../db/models/user.js";

export const addWater = async (payload) => {
  const user = await UsersCollection.findOne({ _id: payload.userId });
  const userDailyNorma = user.dailyNorma || 1.5;
  const createdAt = payload.date ? new Date(payload.date) : new Date();
  const dailyNorma = payload.dailyNorma || userDailyNorma;
  const newPayload = {
    ...payload,
    createdAt,
    dailyNorma
  };
const water = await WaterCollection.create(newPayload);
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
    _id: waterId,
  });
  return water;
};

export const updateDailyNorma = async (userId, newDailyNorma) => {
  await UsersCollection.updateOne({ _id: userId }, { $set: { dailyNorma: newDailyNorma } });
  await WaterCollection.updateMany({ userId: userId }, { $set: { dailyNorma: newDailyNorma } });
};

export const getWaterConsumptionByDate = async (userId, date) => {
  const user = await UsersCollection.findOne({ _id: userId });
  const userDailyNorma = user.dailyNorma || 1.5;
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
  // const dailyNorma = waterData[0].dailyNorma * 1000;
  const dailyNorma = userDailyNorma * 1000;
  const percentageConsumed = ((totalAmount / dailyNorma) * 100).toFixed(0) + "%";

  return {
    waterData,
    totalAmount,
    percentageConsumed
  };
};



export const getMonthWater = async (userId, date) => {
  const user = await UsersCollection.findOne({ _id: userId });
  const userDailyNorma = user.dailyNorma || 1.5;
  const [year, month] = date.split("-");
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  const waterMonth = await WaterCollection.aggregate([
    {
      $match: {
        userId: userId,
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" }
        },
        amountOfWater: { $sum: "$amountOfWater" },
        dailyNorma: { $first: "$dailyNorma" }
      }
    },
    {
      $addFields: {
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day"
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        date: 1,
        amountOfWater: 1,
        dailyNorma: 1
      }
    },
    {
      $sort: { date: 1 }
    }
  ]);
  
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const totalMonthlyWater = waterMonth.reduce((sum, entry) => sum + (entry.amountOfWater || 0), 0);
  const daysInMonth = new Date(year, month, 0).getDate();
  const totalMonthlyNorma = waterMonth.reduce((total, entry) => total + (entry.dailyNorma || userDailyNorma) * 1000, 0);

  const result = waterMonth.map((entry) => {
    const date = new Date(entry.date);
    const getMonth = date.getUTCMonth();
    const getDay = date.getUTCDate(); 
    const dailyNorma = entry.dailyNorma || userDailyNorma;
    const amountOfWater = entry.amountOfWater || 0;


    return {
      date: `${months[getMonth]}, ${getDay}`,
      dailyNorma,
      amountOfWater,
      percentage: Math.floor((amountOfWater / (dailyNorma * 1000)) * 100) + '%',
      // recordsWater: entry.entries ? entry.entries.length : 0,
    };
  });

  const monthlyPercentage = totalMonthlyNorma > 0 ? Math.floor((totalMonthlyWater / totalMonthlyNorma) * 100) : 0;

  return {
    totalMonthlyWater: (totalMonthlyWater / 1000),
    totalMonthlyWaterPercentage: `${monthlyPercentage}%`,
    records: result,
  };
};

// рекордс - раптом треба вивести всі записи про додану воду за місяць


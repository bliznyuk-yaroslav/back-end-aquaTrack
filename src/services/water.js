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
  const percentageConsumed = ((totalAmount / dailyNorma) * 100).toFixed(0) + "%";

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
  const dailyWater = waterMonth.length > 0 ? waterMonth[0].dailyWater || 1.5 : 1.5;
  const daysInMonth = new Date(year, month, 0).getDate();
  const totalMonthlyNorma = dailyWater * 1000 * daysInMonth;

  const result = waterMonth.map((entry) => {
    const getMonth = entry.createdAt.getMonth();
    const getDay = entry.createdAt.getDate();
    const dailyNorma = entry.dailyNorma || dailyWater;
    const totalAmount = entry.totalAmount || 0;
    const amountOfWater = entry.amountOfWater || 0;


    return {
      date: `${months[getMonth]}, ${getDay}`,
      dailyNorma,
      amountOfWater,
      percentage: Math.floor((amountOfWater / (dailyWater * 1000)) * 100) + '%',
      // recordsWater: entry.entries ? entry.entries.length : 0,
    };
  });

  const monthlyPercentage = Math.floor((totalMonthlyWater / (dailyWater * 1000)) * 100);

  return {
    totalMonthlyWater: (totalMonthlyWater / 1000),
    totalMonthlyWaterPercentage: `${monthlyPercentage}%`,
    records: result,
  };
}; 

// рекордс - раптом треба вивести всі записи про додану воду за місяць






// export const getMonthWater = async (userId, date) => {
//   const [year, month] = date.split("-");
//   const startDate = new Date(Date.UTC(year, month - 1, 1));
//   const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

//   const waterMonth = await WaterCollection.find({
//     userId: userId,
//     createdAt: {
//       $gte: startDate,
//       $lte: endDate
//     }
//   });

//   const totalMonthlyWater = waterMonth.reduce((sum, entry) => sum + (entry.amountOfWater || 0), 0);

//   return {
// totalMonthlyWater,
//   };

// };


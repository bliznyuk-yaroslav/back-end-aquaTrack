import {
  addWater,
  deleteWater,
  getMonthWater,
  getWaterConsumptionByDate,
  patchWater,
  updateDailyNorma,
} from '../services/water.js';
import createHttpError from 'http-errors';
const filterUserFields = (water) => {
  return {
    id: water._id,
    amountOfWater: water.amountOfWater,
    time: water.time,
    date: water.date,
    dailyNorma: water.dailyNorma,
    totalAmount: water.totalAmount,
    userId: water.userId,
  };
};
export const addWaterController = async (req, res, next) => {
  const { _id: userId } = req.user;
  try {
    const waterData = { ...req.body, userId };
    const water = await addWater(waterData);
    const userFilter = filterUserFields(water);
    res.status(201).json({
      status: 201,
      message: 'Succesfully add water amount!',
      data: userFilter,
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
      return next();
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
  const { waterId } = req.params;

  const water = await deleteWater(waterId);

  if (!water) {
    next(createHttpError(404, 'No amout of water found'));
    return;
  }
  res.status(204).send();
};

export const updateDailyNormaController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { dailyNorma } = req.body;

    if (!dailyNorma) {
      return res.status(400).json({ message: "Daily norma is required!" });
    }
    await updateDailyNorma(userId, dailyNorma);

    return res.status(200).json({ message: "Daily norma updated successfully!" });
  } catch (error) {
    return res.sttus(500).json({ message: error.message });
  }
};


export const getWaterConsumptionController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { date } = req.params;

    if (!date) {
      return next(createHttpError(400, 'Date query parameter is required'));
    }

    const { waterData, totalAmount, percentageConsumed } =
      await getWaterConsumptionByDate(userId, date);
    const filteredWaterData = waterData.map(filterUserFields);

    res.status(200).json({
      status: 200,
      message: 'Successfully retrieved water consumption data!',
      data: {
        waterData: filteredWaterData,
        totalAmount,
        percentageConsumed,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthWaterController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { date } = req.params;

    const [year, month] = date.split('-');

    const monthNumber = parseInt(month, 10);
    const yearNumber = parseInt(year, 10);

    if (
      isNaN(monthNumber) ||
      isNaN(yearNumber) ||
      monthNumber < 1 ||
      monthNumber > 12
    ) {
      return res
        .status(400)
        .json({ message: 'Invalid date format! Use firstly year, then month' });
    }

    const waterMonth = await getMonthWater(
      userId,
      `${yearNumber}-${monthNumber}`,
    );

    res.status(200).json({
      status: 200,
      message: 'Successfully found amount of water for this month!',
      data: waterMonth,
    });
  } catch (error) {
    next(error);
  }
};

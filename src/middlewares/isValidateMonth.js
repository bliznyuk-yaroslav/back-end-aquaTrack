import createHttpError from 'http-errors';

const isValidateMonth = (req, res, next) => {
    const { date } = req.params;
    const regularExp = /^\d{4}-(0[1-9]|1[0-2])$/;

    if (!regularExp) {
        return next(createHttpError(400, `Invalid date format ${date}. Use YYYY-MM`));
    }

    next();
};

export default isValidateMonth;
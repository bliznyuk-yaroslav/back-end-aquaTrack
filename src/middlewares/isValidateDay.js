import createHttpError from 'http-errors';

const isValidateDay = (req, res, next) => {
    const { date } = req.params;
    const regularExp = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

    if (!regularExp.test(date)) {
        return next(createHttpError(400, `Invalid date format ${date}. Use YYYY-MM-DD`));
    }

    next();
};

export default isValidateDay;
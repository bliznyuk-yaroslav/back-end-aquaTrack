import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';
const isValid = (req, res, next) => {
  const { id } = req.user;
  if (!isValidObjectId(id)) {
    return next(createHttpError(404, 'User not found'));
  }
  next();
};
export default isValid;

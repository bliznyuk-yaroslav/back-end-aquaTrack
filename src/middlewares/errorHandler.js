import { HttpError } from 'http-errors';
const errorHandler = (error, req, res, next) => {
  if (error instanceof HttpError) {
    const { status, message } = error;
    res.status(status).json({
      status,
      message,
      data: error,
    });
    return;
  }
  res.status(404).json({
    status: 404,
    message: 'Something went wrong',
    data: { message: 'Not found' },
  });
  next();
};
export default errorHandler;

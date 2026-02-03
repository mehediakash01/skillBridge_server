import { ErrorRequestHandler } from 'express';

const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Something went wrong',
    error: err,
  });
};

export default globalErrorHandler;

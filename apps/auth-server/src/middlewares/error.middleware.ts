import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { CustomError } from '../interfaces/customError.interface';

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: CustomError = new Error('Validation failed');
    error.statusCode = 400;
    error.errors = errors.array();
    throw error;
  }
  next();
};

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[Error]', err.message);
  
  const status = err.statusCode || 500;
  const response: {
    error: string;
    details?: any;
    stack?: string;
  } = {
    error: err.message || 'Internal Server Error'
  };
  
  res.status(status).json(response);
};

module.exports = {
  validateRequest,
  errorHandler
};
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error occurred:', error);
  
  // Default error response
  const errorResponse = {
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  };

  // Handle specific error types
  if (error.name === 'ValidationError') {
    res.status(400).json({
      ...errorResponse,
      error: 'Validation Error',
      message: error.message
    });
  } else if (error.name === 'UnauthorizedError') {
    res.status(401).json({
      ...errorResponse,
      error: 'Unauthorized',
      message: 'Invalid API key or authentication required'
    });
  } else if (error.name === 'RateLimitError') {
    res.status(429).json({
      ...errorResponse,
      error: 'Too Many Requests',
      message: 'Rate limit exceeded'
    });
  } else {
    res.status(500).json(errorResponse);
  }
};
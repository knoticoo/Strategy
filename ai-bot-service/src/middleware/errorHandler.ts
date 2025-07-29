import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  _error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error occurred:', _error);
  
  // Default error response
  const errorResponse = {
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? _error.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  };

  // Handle specific error types
  if (_error.name === 'ValidationError') {
    res.status(400).json({
      ...errorResponse,
      error: 'Validation Error',
      message: _error.message
    });
  } else if (_error.name === 'UnauthorizedError') {
    res.status(401).json({
      ...errorResponse,
      error: 'Unauthorized',
      message: 'Invalid API key or authentication required'
    });
  } else if (_error.name === 'RateLimitError') {
    res.status(429).json({
      ...errorResponse,
      error: 'Too Many Requests',
      message: 'Rate limit exceeded'
    });
  } else {
    res.status(500).json(errorResponse);
  }
};
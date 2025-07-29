import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const validateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.headers['x-api-key'] as string;
  const expectedApiKey = process.env.ADMIN_API_KEY || 'admin-key-123';

  if (!apiKey) {
    logger.warn('API key missing for admin route');
    res.status(401).json({
      error: 'Unauthorized',
      message: 'API key required',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (apiKey !== expectedApiKey) {
    logger.warn('Invalid API key provided');
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key',
      timestamp: new Date().toISOString()
    });
    return;
  }

  logger.info('API key validated successfully');
  next();
};
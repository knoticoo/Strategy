import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        logger.warn('Request validation failed:', error.details);
        res.status(400).json({
          error: 'Validation Error',
          message: 'Request validation failed',
          details: error.details,
          timestamp: new Date().toISOString()
        });
        return;
      }
      next();
    } catch (error) {
      logger.error('Validation middleware error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Validation service error',
        timestamp: new Date().toISOString()
      });
    }
  };
};
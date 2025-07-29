import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { logger } from '../utils/logger';

// Create rate limiter instance
const rateLimiterInstance = new RateLimiterMemory({
  keyPrefix: 'api',
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const key = req.headers['x-api-key'] as string || req.ip || 'unknown';
    await rateLimiterInstance.consume(key);
    next();
  } catch (error) {
    logger.warn('Rate limit exceeded for IP:', req.ip);
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      timestamp: new Date().toISOString()
    });
  }
};

// Export the middleware function
export const rateLimiter = rateLimiterMiddleware;
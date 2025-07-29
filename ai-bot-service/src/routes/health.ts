import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/v1/health - Health check endpoint
router.get('/', (req: Request, res: Response) => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '1.0.0',
      service: 'AI Veterinary Bot Service'
    };
    
    logger.info('Health check requested');
    res.json(healthStatus);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'unhealthy', 
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/v1/health/detailed - Detailed health check
router.get('/detailed', (req: Request, res: Response) => {
  try {
    const detailedHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        rss: process.memoryUsage().rss,
        heapTotal: process.memoryUsage().heapTotal,
        heapUsed: process.memoryUsage().heapUsed,
        external: process.memoryUsage().external
      },
      cpu: process.cpuUsage(),
      version: '1.0.0',
      service: 'AI Veterinary Bot Service',
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform
    };
    
    logger.info('Detailed health check requested');
    res.json(detailedHealth);
  } catch (error) {
    logger.error('Detailed health check failed:', error);
    res.status(500).json({ 
      status: 'unhealthy', 
      error: 'Detailed health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
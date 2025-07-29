import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';

import { logger } from './utils/logger';
import { setupDatabase } from './database/setup';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { validateApiKey } from './middleware/auth';

// Import routes
import chatRoutes from './routes/chat';
import healthRoutes from './routes/health';
import medicinesRoutes from './routes/medicines';
import analyticsRoutes from './routes/analytics';
import adminRoutes from './routes/admin';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

class AIBotServer {
  private app: express.Application;
  private server: any;

  constructor() {
    this.app = app;
    this.server = server;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];
    this.app.use(cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    }));

    // Request parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging
    this.app.use(morgan('combined', { 
      stream: { write: (message) => logger.info(message.trim()) }
    }));

    // Rate limiting
    this.app.use(rateLimiter);

    // API key validation for protected routes
    this.app.use('/api/v1/admin', validateApiKey);
  }

  private setupRoutes(): void {
    // Health check (no auth required)
    this.app.use('/api/v1/health', healthRoutes);

    // Main API routes
    this.app.use('/api/v1/chat', chatRoutes);
    this.app.use('/api/v1/medicines', medicinesRoutes);
    this.app.use('/api/v1/analytics', analyticsRoutes);
    this.app.use('/api/v1/admin', adminRoutes);

    // Root endpoint
    this.app.get('/', (_req, res) => {
      res.json({
        name: 'AI Veterinary Bot Service',
        version: '1.0.0',
        status: 'running',
        endpoints: {
          health: '/api/v1/health',
          chat: '/api/v1/chat',
          medicines: '/api/v1/medicines',
          analytics: '/api/v1/analytics',
          admin: '/api/v1/admin'
        },
        documentation: '/api/v1/health/docs'
      });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Endpoint not found',
        message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
        availableEndpoints: [
          'GET /api/v1/health',
          'POST /api/v1/chat/ask',
          'GET /api/v1/medicines',
          'GET /api/v1/analytics/stats'
        ]
      });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Initialize database
      await setupDatabase();
      logger.info('✅ Database initialized successfully');

      // Start server
      this.server.listen(PORT, () => {
        logger.info(`🚀 AI Veterinary Bot Service started on port ${PORT}`);
        logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
        logger.info(`🔗 Health check: http://localhost:${PORT}/api/v1/health`);
        logger.info(`📚 API Documentation: http://localhost:${PORT}/api/v1/health/docs`);
        
        // Log configuration
        logger.info('🔧 Configuration:');
        logger.info(`   - AI Provider: ${process.env.AI_PROVIDER || 'fallback'}`);
        logger.info(`   - Database: ${process.env.DATABASE_TYPE || 'sqlite'}`);
        logger.info(`   - Cache: ${process.env.REDIS_URL ? 'Redis' : 'Memory'}`);
        logger.info(`   - Rate Limit: ${process.env.RATE_LIMIT_MAX_REQUESTS || 100} req/15min`);
      });

      // Graceful shutdown
      process.on('SIGTERM', () => this.shutdown());
      process.on('SIGINT', () => this.shutdown());

    } catch (error) {
      logger.error('❌ Failed to start AI Bot Service:', error);
      process.exit(1);
    }
  }

  private async shutdown(): Promise<void> {
    logger.info('🔄 Shutting down AI Bot Service...');
    
    this.server.close(() => {
      logger.info('✅ Server closed successfully');
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error('❌ Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  }
}

// Start the server
const botServer = new AIBotServer();
botServer.start().catch((error) => {
  logger.error('💥 Fatal error starting server:', error);
  process.exit(1);
});

export default app;
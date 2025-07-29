import { Router, Request, Response } from 'express';
import { spawn, exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { logger } from '../utils/logger';

const router = Router();

// Global state for training process
let trainingProcess: any = null;
let trainingStatus = {
  isTraining: false,
  progress: 0,
  currentEpoch: 0,
  totalEpochs: 3,
  currentLoss: 0,
  bestLoss: Infinity,
  trainingTime: '00:00:00',
  estimatedTimeRemaining: 'Calculating...',
  datasetSize: 0,
  modelSize: '0 MB',
  status: 'idle' as 'idle' | 'collecting_data' | 'training' | 'completed' | 'error',
  lastUpdated: new Date().toISOString(),
  startTime: null as Date | null
};

let systemStartTime = new Date();
let adminStats = {
  totalQueries: 0,
  successfulResponses: 0,
  averageResponseTime: 0,
  activeUsers: 0,
  medicationsGenerated: 0,
  translationsPerformed: 0,
  uptime: '00:00:00'
};

// Helper function to get system stats
const getSystemStats = async () => {
  try {
    // Get CPU usage
    const cpuUsage = await new Promise<number>((resolve) => {
      exec("top -bn1 | grep 'Cpu(s)' | awk '{print 100 - $8}'", (error, stdout) => {
        if (error) resolve(0);
        else resolve(parseFloat(stdout.trim()) || 0);
      });
    });

    // Get memory usage
    const memInfo = await fs.readFile('/proc/meminfo', 'utf8');
    const memLines = memInfo.split('\n');
    const memTotal = parseInt(memLines.find(line => line.startsWith('MemTotal:'))?.split(/\s+/)[1] || '0') / 1024; // MB
    const memAvailable = parseInt(memLines.find(line => line.startsWith('MemAvailable:'))?.split(/\s+/)[1] || '0') / 1024; // MB
    const memUsed = memTotal - memAvailable;
    const memPercentage = (memUsed / memTotal) * 100;

    // Get disk usage
    const diskUsage = await new Promise<{used: number, total: number, percentage: number}>((resolve) => {
      exec("df -h / | awk 'NR==2 {print $3 \" \" $2 \" \" $5}'", (error, stdout) => {
        if (error) {
          resolve({used: 0, total: 0, percentage: 0});
        } else {
          const parts = stdout.trim().split(' ');
          const used = parseFloat(parts[0].replace('G', '')) * 1024; // Convert to MB
          const total = parseFloat(parts[1].replace('G', '')) * 1024; // Convert to MB
          const percentage = parseFloat(parts[2].replace('%', ''));
          resolve({used, total, percentage});
        }
      });
    });

    return {
      cpu: {
        usage: cpuUsage,
        cores: os.cpus().length,
        temperature: undefined // Could add temperature monitoring
      },
      memory: {
        used: memUsed,
        total: memTotal,
        percentage: memPercentage
      },
      disk: diskUsage
    };
  } catch (error) {
    logger.error('Failed to get system stats:', error);
    return {
      cpu: { usage: 0, cores: os.cpus().length },
      memory: { used: 0, total: 4096, percentage: 0 },
      disk: { used: 0, total: 50000, percentage: 0 }
    };
  }
};

// Helper function to calculate uptime
const calculateUptime = () => {
  const now = new Date();
  const diff = now.getTime() - systemStartTime.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Helper function to calculate training time
const calculateTrainingTime = () => {
  if (!trainingStatus.startTime) return '00:00:00';
  const now = new Date();
  const diff = now.getTime() - trainingStatus.startTime.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// GET /api/v1/admin/training-status - Get current training status
router.get('/training-status', async (req: Request, res: Response) => {
  try {
    // Update training time if training is active
    if (trainingStatus.isTraining) {
      trainingStatus.trainingTime = calculateTrainingTime();
      
      // Estimate remaining time based on progress
      if (trainingStatus.progress > 0) {
        const elapsedMs = new Date().getTime() - (trainingStatus.startTime?.getTime() || 0);
        const totalEstimatedMs = (elapsedMs / trainingStatus.progress) * 100;
        const remainingMs = totalEstimatedMs - elapsedMs;
        const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
        const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        trainingStatus.estimatedTimeRemaining = `${remainingHours}h ${remainingMinutes}m`;
      }
    }

    trainingStatus.lastUpdated = new Date().toISOString();
    res.json(trainingStatus);
  } catch (error) {
    logger.error('Failed to get training status:', error);
    res.status(500).json({ error: 'Failed to get training status' });
  }
});

// GET /api/v1/admin/system-stats - Get system resource usage
router.get('/system-stats', async (req: Request, res: Response) => {
  try {
    const stats = await getSystemStats();
    res.json(stats);
  } catch (error) {
    logger.error('Failed to get system stats:', error);
    res.status(500).json({ error: 'Failed to get system stats' });
  }
});

// GET /api/v1/admin/model-info - Get model information
router.get('/model-info', async (req: Request, res: Response) => {
  try {
    const modelPath = path.join(__dirname, '../../ai-training/models');
    const configPath = path.join(modelPath, 'config.json');
    
    let modelInfo = {
      name: 'VeterinaryAI-DialoGPT',
      version: '1.0.0',
      size: 'Not trained',
      parameters: 'Unknown',
      trainingData: trainingStatus.datasetSize,
      accuracy: 0,
      languages: ['English', 'Latvian', 'Russian'],
      lastTrained: 'Never',
      isActive: false
    };

    try {
      // Check if model exists
      await fs.access(modelPath);
      
      // Try to read model config
      const configData = await fs.readFile(configPath, 'utf8');
      const config = JSON.parse(configData);
      
      // Get model size
      const stats = await fs.stat(path.join(modelPath, 'pytorch_model.bin'));
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(1);
      
      modelInfo = {
        ...modelInfo,
        size: `${sizeInMB} MB`,
        parameters: config.num_parameters || 'Unknown',
        accuracy: config.best_accuracy || 0,
        lastTrained: config.training_completed || 'Unknown',
        isActive: trainingStatus.status === 'completed'
      };
    } catch (error) {
      // Model doesn't exist or config is missing
      logger.info('Model not found or config missing');
    }

    res.json(modelInfo);
  } catch (error) {
    logger.error('Failed to get model info:', error);
    res.status(500).json({ error: 'Failed to get model info' });
  }
});

// GET /api/v1/admin/stats - Get admin statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    adminStats.uptime = calculateUptime();
    res.json(adminStats);
  } catch (error) {
    logger.error('Failed to get admin stats:', error);
    res.status(500).json({ error: 'Failed to get admin stats' });
  }
});

// POST /api/v1/admin/start-training - Start AI model training
router.post('/start-training', async (req: Request, res: Response) => {
  try {
    if (trainingStatus.isTraining) {
      return res.status(400).json({ error: 'Training is already in progress' });
    }

    logger.info('Starting AI model training...');
    
    // Reset training status
    trainingStatus = {
      ...trainingStatus,
      isTraining: true,
      progress: 0,
      currentEpoch: 0,
      currentLoss: 0,
      bestLoss: Infinity,
      status: 'collecting_data',
      startTime: new Date(),
      lastUpdated: new Date().toISOString()
    };

    // Start data collection first
    const trainingDir = path.join(__dirname, '../../ai-training');
    const venvPath = path.join(process.cwd(), '../venv/bin/activate');
    
    // Start data collection
    const dataCollectionProcess = spawn('bash', ['-c', `source ${venvPath} && python3 data_collector.py`], {
      cwd: trainingDir,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let datasetSize = 0;
    
    dataCollectionProcess.stdout?.on('data', (data) => {
      const output = data.toString();
      logger.info(`Data collection: ${output}`);
      
      // Parse dataset size from output
      const sizeMatch = output.match(/Dataset size: (\d+)/);
      if (sizeMatch) {
        datasetSize = parseInt(sizeMatch[1]);
        trainingStatus.datasetSize = datasetSize;
      }
      
      // Update progress for data collection (0-20%)
      if (output.includes('Wikipedia')) trainingStatus.progress = 5;
      if (output.includes('PubMed')) trainingStatus.progress = 10;
      if (output.includes('Websites')) trainingStatus.progress = 15;
      if (output.includes('Training pairs generated')) trainingStatus.progress = 20;
    });

    dataCollectionProcess.on('close', (code) => {
      if (code === 0) {
        logger.info('Data collection completed, starting model training...');
        trainingStatus.status = 'training';
        trainingStatus.progress = 20;
        
        // Start model training
        const modelTrainingProcess = spawn('bash', ['-c', `source ${venvPath} && python3 model_trainer.py`], {
          cwd: trainingDir,
          stdio: ['pipe', 'pipe', 'pipe']
        });

        trainingProcess = modelTrainingProcess;

        modelTrainingProcess.stdout?.on('data', (data) => {
          const output = data.toString();
          logger.info(`Training: ${output}`);
          
          // Parse training progress
          const epochMatch = output.match(/Epoch (\d+)\/(\d+)/);
          if (epochMatch) {
            trainingStatus.currentEpoch = parseInt(epochMatch[1]);
            trainingStatus.totalEpochs = parseInt(epochMatch[2]);
            trainingStatus.progress = 20 + ((trainingStatus.currentEpoch / trainingStatus.totalEpochs) * 80);
          }
          
          // Parse loss
          const lossMatch = output.match(/Loss: ([\d.]+)/);
          if (lossMatch) {
            trainingStatus.currentLoss = parseFloat(lossMatch[1]);
            if (trainingStatus.currentLoss < trainingStatus.bestLoss) {
              trainingStatus.bestLoss = trainingStatus.currentLoss;
            }
          }
        });

        modelTrainingProcess.on('close', (trainingCode) => {
          if (trainingCode === 0) {
            logger.info('Model training completed successfully!');
            trainingStatus.isTraining = false;
            trainingStatus.status = 'completed';
            trainingStatus.progress = 100;
          } else {
            logger.error('Model training failed');
            trainingStatus.isTraining = false;
            trainingStatus.status = 'error';
          }
          trainingProcess = null;
        });
      } else {
        logger.error('Data collection failed');
        trainingStatus.isTraining = false;
        trainingStatus.status = 'error';
      }
    });

    res.json({ message: 'Training started successfully', status: trainingStatus });
  } catch (error) {
    logger.error('Failed to start training:', error);
    trainingStatus.isTraining = false;
    trainingStatus.status = 'error';
    res.status(500).json({ error: 'Failed to start training' });
  }
});

// POST /api/v1/admin/stop-training - Stop AI model training
router.post('/stop-training', async (req: Request, res: Response) => {
  try {
    if (!trainingStatus.isTraining) {
      return res.status(400).json({ error: 'No training in progress' });
    }

    logger.info('Stopping AI model training...');
    
    if (trainingProcess) {
      trainingProcess.kill('SIGTERM');
      trainingProcess = null;
    }

    trainingStatus.isTraining = false;
    trainingStatus.status = 'idle';
    trainingStatus.lastUpdated = new Date().toISOString();

    res.json({ message: 'Training stopped successfully', status: trainingStatus });
  } catch (error) {
    logger.error('Failed to stop training:', error);
    res.status(500).json({ error: 'Failed to stop training' });
  }
});

// POST /api/v1/admin/restart-services - Restart all services
router.post('/restart-services', async (req: Request, res: Response) => {
  try {
    logger.info('Restarting services...');
    
    // In a production environment, you might use PM2 or similar
    // For now, we'll just log the request
    res.json({ message: 'Service restart initiated' });
    
    // Restart after sending response
    setTimeout(() => {
      process.exit(0); // This will cause the process manager to restart the service
    }, 1000);
  } catch (error) {
    logger.error('Failed to restart services:', error);
    res.status(500).json({ error: 'Failed to restart services' });
  }
});

// Middleware to track API usage for admin stats
router.use((req: Request, res: Response, next) => {
  adminStats.totalQueries++;
  
  const startTime = Date.now();
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    if (res.statusCode < 400) {
      adminStats.successfulResponses++;
    }
    
    // Update average response time
    adminStats.averageResponseTime = Math.round(
      (adminStats.averageResponseTime * (adminStats.totalQueries - 1) + responseTime) / adminStats.totalQueries
    );
  });
  
  next();
});

export default router;
import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import { logger } from '../utils/logger';
import path from 'path';
import fs from 'fs';

export interface LocalAIResponse {
  answer: string;
  confidence: number;
  provider: string;
  reasoning: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
}

export interface LocalAIRequest {
  query: string;
  species: string;
  language: 'en' | 'lv' | 'ru';
  context?: string;
}

export class LocalAIProvider extends EventEmitter {
  private pythonProcess: ChildProcess | null = null;
  private isInitialized: boolean = false;
  private modelPath: string;
  private requestQueue: Array<{
    request: LocalAIRequest;
    resolve: (response: LocalAIResponse) => void;
    reject: (error: Error) => void;
  }> = [];
  private isProcessing: boolean = false;

  constructor() {
    super();
    this.modelPath = path.join(__dirname, '../../ai-training/models/veterinary-ai-model');
    logger.info('🤖 Local AI Provider initialized');
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    logger.info('🚀 Starting local AI model...');

    try {
      // Check if model exists
      if (!fs.existsSync(this.modelPath)) {
        throw new Error(`Model not found at ${this.modelPath}. Please train the model first.`);
      }

      // Start Python inference server
      await this.startInferenceServer();
      this.isInitialized = true;
      
      logger.info('✅ Local AI model ready for inference');
    } catch (error) {
      logger.error('❌ Failed to initialize local AI:', error);
      throw error;
    }
  }

  private async startInferenceServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, '../../ai-training/inference_server.py');
      
      this.pythonProcess = spawn('python3', [scriptPath, this.modelPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: path.dirname(scriptPath)
      });

      let initOutput = '';

      this.pythonProcess.stdout?.on('data', (data) => {
        const output = data.toString();
        initOutput += output;
        
        if (output.includes('Model loaded successfully')) {
          resolve();
        }
      });

      this.pythonProcess.stderr?.on('data', (data) => {
        const error = data.toString();
        logger.error('Python inference error:', error);
        
        if (!this.isInitialized) {
          reject(new Error(`Failed to start inference server: ${error}`));
        }
      });

      this.pythonProcess.on('close', (code) => {
        logger.warn(`Python inference server closed with code ${code}`);
        this.isInitialized = false;
        this.pythonProcess = null;
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!this.isInitialized) {
          reject(new Error('Timeout waiting for inference server to start'));
        }
      }, 30000);
    });
  }

  async generateVeterinaryResponse(
    query: string,
    species: string,
    context: string,
    language: 'en' | 'lv' | 'ru' = 'en'
  ): Promise<LocalAIResponse> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const request: LocalAIRequest = {
      query,
      species,
      language,
      context
    };

    return new Promise((resolve, reject) => {
      this.requestQueue.push({ request, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const { request, resolve, reject } = this.requestQueue.shift()!;

      try {
        const response = await this.processRequest(request);
        resolve(response);
      } catch (error) {
        reject(error as Error);
      }
    }

    this.isProcessing = false;
  }

  private async processRequest(request: LocalAIRequest): Promise<LocalAIResponse> {
    return new Promise((resolve, reject) => {
      if (!this.pythonProcess || !this.pythonProcess.stdin) {
        reject(new Error('Python process not available'));
        return;
      }

      // Send request to Python process
      const requestData = JSON.stringify(request) + '\n';
      this.pythonProcess.stdin.write(requestData);

      // Listen for response
      const responseHandler = (data: Buffer) => {
        try {
          const responseText = data.toString().trim();
          if (responseText) {
            const lines = responseText.split('\n');
            for (const line of lines) {
              if (line.startsWith('{')) {
                const response = JSON.parse(line);
                
                // Clean up listener
                this.pythonProcess?.stdout?.removeListener('data', responseHandler);
                
                // Format response
                const aiResponse: LocalAIResponse = {
                  answer: response.answer || 'I apologize, but I encountered an issue generating a response.',
                  confidence: response.confidence || 0.5,
                  provider: 'Local Veterinary AI',
                  reasoning: response.reasoning || 'Generated using local trained model',
                  urgency: this.determineUrgency(response.answer || '')
                };

                resolve(aiResponse);
                return;
              }
            }
          }
        } catch (error) {
          this.pythonProcess?.stdout?.removeListener('data', responseHandler);
          reject(new Error(`Failed to parse AI response: ${error}`));
        }
      };

      this.pythonProcess.stdout?.on('data', responseHandler);

      // Timeout after 30 seconds
      setTimeout(() => {
        this.pythonProcess?.stdout?.removeListener('data', responseHandler);
        reject(new Error('Timeout waiting for AI response'));
      }, 30000);
    });
  }

  private determineUrgency(response: string): 'low' | 'medium' | 'high' | 'emergency' {
    const emergencyKeywords = /\b(emergency|urgent|critical|immediate|life-threatening|toxic|poison)\b/gi;
    const highKeywords = /\b(serious|severe|concerning|worrying|painful)\b/gi;
    const mediumKeywords = /\b(monitor|watch|observe|check)\b/gi;

    const responseLower = response.toLowerCase();

    if (emergencyKeywords.test(responseLower)) return 'emergency';
    if (highKeywords.test(responseLower)) return 'high';
    if (mediumKeywords.test(responseLower)) return 'medium';
    return 'low';
  }

  async getMedicationInfo(medicationName: string): Promise<any[]> {
    logger.info(`💊 LOCAL AI: Looking up medication "${medicationName}"`);
    
    try {
      const response = await this.generateVeterinaryResponse(
        `Tell me about ${medicationName} medication for animals. Include dosage, side effects, and what it treats.`,
        'general',
        'medication_lookup'
      );

      // Parse the response to extract structured medication info
      return [{
        name: medicationName,
        description: response.answer,
        confidence: response.confidence,
        source: 'Local AI Model',
        category: 'medication',
        species: ['general'],
        urgency: response.urgency
      }];
    } catch (error) {
      logger.error('❌ Failed to get medication info from local AI:', error);
      return [];
    }
  }

  async getSpeciesInfo(species: string, language: 'en' | 'lv' | 'ru' = 'en'): Promise<any> {
    logger.info(`🐾 LOCAL AI: Getting species info for "${species}"`);
    
    try {
      const response = await this.generateVeterinaryResponse(
        `Tell me about ${species} health, common diseases, care requirements, and important health information.`,
        species,
        'species_info',
        language
      );

      return {
        species,
        description: response.answer,
        confidence: response.confidence,
        language,
        source: 'Local AI Model'
      };
    } catch (error) {
      logger.error('❌ Failed to get species info from local AI:', error);
      return null;
    }
  }

  async generateMedicationsList(): Promise<any[]> {
    logger.info('💊 LOCAL AI: Generating comprehensive medications list...');
    
    const commonMedications = [
      'Amoxicillin', 'Prednisone', 'Metacam', 'Rimadyl', 'Tramadol',
      'Gabapentin', 'Furosemide', 'Enalapril', 'Metronidazole', 'Cephalexin',
      'Prednisolone', 'Carprofen', 'Buprenorphine', 'Pimobendan', 'Dexamethasone'
    ];

    const medications = [];

    for (const medName of commonMedications) {
      try {
        const medInfo = await this.getMedicationInfo(medName);
        if (medInfo.length > 0) {
          medications.push(medInfo[0]);
        }
        
        // Small delay to prevent overwhelming the model
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        logger.warn(`Failed to get info for ${medName}:`, error);
      }
    }

    logger.info(`✅ Generated information for ${medications.length} medications`);
    return medications;
  }

  getStats(): any {
    return {
      isInitialized: this.isInitialized,
      queueLength: this.requestQueue.length,
      isProcessing: this.isProcessing,
      modelPath: this.modelPath,
      provider: 'Local Veterinary AI',
      processId: this.pythonProcess?.pid || null
    };
  }

  async shutdown(): Promise<void> {
    logger.info('🔄 Shutting down local AI provider...');
    
    if (this.pythonProcess) {
      this.pythonProcess.kill('SIGTERM');
      this.pythonProcess = null;
    }
    
    this.isInitialized = false;
    this.requestQueue = [];
    
    logger.info('✅ Local AI provider shut down successfully');
  }
}

export const localAIProvider = new LocalAIProvider();
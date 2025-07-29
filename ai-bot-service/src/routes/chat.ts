import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';

import { AIVeterinaryBot } from '../services/AIVeterinaryBot';
import { logger } from '../utils/logger';
import { validateRequest } from '../middleware/validation';
import { ConversationDatabase } from '../database/ConversationDatabase';

const router = Router();
const aiBot = new AIVeterinaryBot();
const conversationDb = new ConversationDatabase();

// Validation schemas
const askSchema = Joi.object({
  query: Joi.string().required().min(1).max(1000),
  species: Joi.string().valid('dog', 'cat', 'bird', 'rabbit', 'hamster', 'guinea_pig', 'fish', 'reptile').required(),
  language: Joi.string().valid('en', 'lv', 'ru').optional(),
  sessionId: Joi.string().uuid().optional(),
  context: Joi.object({
    previousQueries: Joi.array().items(Joi.string()).max(5).optional(),
    petAge: Joi.string().optional(),
    petBreed: Joi.string().optional(),
    symptoms: Joi.array().items(Joi.string()).optional()
  }).optional()
});

const feedbackSchema = Joi.object({
  conversationId: Joi.string().uuid().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  feedback: Joi.string().max(500).optional(),
  helpful: Joi.boolean().required()
});

// POST /api/v1/chat/ask - Main chat endpoint
router.post('/ask', validateRequest(askSchema), async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { query, species, language, sessionId, context } = req.body;
  const conversationId = uuidv4();

  try {
    logger.info(`🗣️ Chat request: "${query}" for ${species} (Session: ${sessionId || 'new'})`);

    // Generate AI response
    const aiResponse = await aiBot.generateResponse({
      query,
      species,
      language: language || 'en',
      sessionId: sessionId || uuidv4(),
      context: context || {}
    });

    // Save conversation to database
    await conversationDb.saveConversation(aiResponse.sessionId, {
      id: conversationId,
      sessionId: aiResponse.sessionId,
      query,
      response: aiResponse.answer,
      species,
      language: aiResponse.language,
      confidence: aiResponse.confidence,
      sources: aiResponse.sources,
      urgency: aiResponse.urgency,
      timestamp: new Date(),
      processingTimeMs: Date.now() - startTime,
      userContext: context
    });

    // Prepare response
    const response = {
      conversationId,
      sessionId: aiResponse.sessionId,
      answer: aiResponse.answer,
      confidence: aiResponse.confidence,
      language: aiResponse.language,
      urgency: aiResponse.urgency,
      recommendations: aiResponse.recommendations,
      followUp: aiResponse.followUpQuestions,
      sources: aiResponse.sources.slice(0, 3), // Limit sources in response
      metadata: {
        processingTime: Date.now() - startTime,
        aiProvider: aiResponse.provider,
        reasoning: aiResponse.reasoning,
        totalSources: aiResponse.sources.length
      }
    };

    logger.info(`✅ Chat response generated: ${Math.round(aiResponse.confidence * 100)}% confidence in ${Date.now() - startTime}ms`);
    
    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    logger.error('❌ Chat request failed:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to generate AI response',
      conversationId,
      fallback: {
        answer: `I apologize, but I'm experiencing technical difficulties. For your ${species}'s health concern, please consult with a qualified veterinarian who can provide proper diagnosis and treatment.`,
        confidence: 0,
        urgency: 'medium',
        recommendations: ['Consult a veterinarian', 'Monitor your pet closely']
      }
    });
  }
});

// POST /api/v1/chat/feedback - Submit feedback for a conversation
router.post('/feedback', validateRequest(feedbackSchema), async (req: Request, res: Response) => {
  const { conversationId, rating, feedback, helpful } = req.body;

  try {
    logger.info(`📝 Feedback received for conversation ${conversationId}: ${rating}/5 stars`);

    await conversationDb.saveFeedback({
      conversationId,
      rating,
      feedback,
      helpful,
      timestamp: new Date()
    });

    // Learn from feedback
    await aiBot.learnFromFeedback(conversationId, {
      rating,
      feedback,
      helpful
    });

    res.json({
      success: true,
      message: 'Feedback received successfully'
    });

  } catch (error) {
    logger.error('❌ Failed to save feedback:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to save feedback'
    });
  }
});

// GET /api/v1/chat/history/:sessionId - Get conversation history
router.get('/history/:sessionId', async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { limit = 10, offset = 0 } = req.query;

  try {
    if (!sessionId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid session ID format'
      });
    }

    const conversations = await conversationDb.getConversationHistory(
      sessionId, 
      parseInt(limit as string), 
      parseInt(offset as string)
    );

    return res.json({
      success: true,
      data: {
        sessionId,
        conversations,
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          total: conversations.length
        }
      }
    });

  } catch (error) {
    logger.error('❌ Failed to fetch conversation history:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation history'
    });
  }
});

// POST /api/v1/chat/translate - Translate text
router.post('/translate', async (req: Request, res: Response) => {
  const translateSchema = Joi.object({
    text: Joi.string().required().max(1000),
    from: Joi.string().valid('en', 'lv', 'ru').optional(),
    to: Joi.string().valid('en', 'lv', 'ru').required(),
    context: Joi.string().valid('medical', 'general').optional()
  });

  const { error } = translateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.details
    });
  }

  const { text, from, to, context } = req.body;

  try {
    const translation = await aiBot.translateText(text, from, to, context);

    return res.json({
      success: true,
      data: {
        originalText: text,
        translatedText: translation.translatedText,
        fromLanguage: translation.fromLanguage,
        toLanguage: translation.toLanguage,
        confidence: translation.confidence,
        service: translation.service
      }
    });

  } catch (error) {
    logger.error('❌ Translation failed:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Translation failed'
    });
  }
});

// GET /api/v1/chat/suggestions/:species - Get suggested questions for a species
router.get('/suggestions/:species', async (req: Request, res: Response) => {
  const { species } = req.params;
  const { language = 'en' } = req.query;

  try {
    const suggestions = await aiBot.getSuggestedQuestions(
      species as any, 
      language as 'en' | 'lv' | 'ru'
    );

    res.json({
      success: true,
      data: {
        species,
        language,
        suggestions
      }
    });

  } catch (error) {
    logger.error('❌ Failed to get suggestions:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to get suggestions'
    });
  }
});

export default router;
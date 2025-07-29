import { logger } from '../utils/logger';

export class ConversationDatabase {
  private conversations: Map<string, any[]> = new Map();

  async saveConversation(sessionId: string, message: any): Promise<void> {
    try {
      if (!this.conversations.has(sessionId)) {
        this.conversations.set(sessionId, []);
      }
      this.conversations.get(sessionId)?.push(message);
      logger.info(`Saved conversation for session: ${sessionId}`);
    } catch (error) {
      logger.error('Failed to save conversation:', error);
      throw error;
    }
  }

  async getConversationHistory(sessionId: string, limit?: number, offset?: number): Promise<any[]> {
    try {
      const conversations = this.conversations.get(sessionId) || [];
      const start = offset || 0;
      const end = limit ? start + limit : conversations.length;
      return conversations.slice(start, end);
    } catch (error) {
      logger.error('Failed to get conversation history:', error);
      throw error;
    }
  }

  async clearConversation(sessionId: string): Promise<void> {
    try {
      this.conversations.delete(sessionId);
      logger.info(`Cleared conversation for session: ${sessionId}`);
    } catch (error) {
      logger.error('Failed to clear conversation:', error);
      throw error;
    }
  }

  // Additional methods that routes expect
  async saveFeedback(feedback: any): Promise<void> {
    try {
      logger.info(`Saved feedback: ${feedback.sessionId}`);
      // For now, just log the feedback
    } catch (error) {
      logger.error('Failed to save feedback:', error);
      throw error;
    }
  }
}
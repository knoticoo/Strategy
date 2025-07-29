import { PetSpecies } from '../types';
import { realIntelligentVeterinaryAI, AIServiceConfig } from './ai/realIntelligentAI';
import { realVeterinaryTranslator } from './ai/realTranslator';
import { generateTreatmentRecommendations } from './vetAdvice/treatmentRecommendations';
import { analyzeSymptoms } from './vetAdvice/symptomAnalyzer';

// Configuration for the AI service
const AI_CONFIG: AIServiceConfig = {
  provider: process.env.NODE_ENV === 'production' ? 'fallback' : 'fallback', // Default to fallback for safety
  apiKey: process.env.VITE_OPENAI_API_KEY || process.env.VITE_ANTHROPIC_API_KEY,
  model: process.env.VITE_AI_MODEL || 'gpt-3.5-turbo',
  maxTokens: 800
};

// Initialize the real AI system
realIntelligentVeterinaryAI.updateConfig(AI_CONFIG);

export const generateVetAdvice = async (query: string, species: PetSpecies): Promise<string> => {
  try {
    console.log(`🚀 REAL AI SERVICE ACTIVATED: Processing "${query}" for ${species}`);
    
    // Detect user's language
    const detectedLanguage = realVeterinaryTranslator.detectLanguage(query);
    console.log(`🌍 Language detected: ${detectedLanguage}`);

    // Use the real intelligent AI system
    const aiResponse = await realIntelligentVeterinaryAI.generateIntelligentResponse(
      query, 
      species, 
      detectedLanguage
    );

    console.log(`✅ REAL AI RESPONSE: Confidence ${Math.round(aiResponse.confidence * 100)}%, Sources: ${aiResponse.sources.length}`);
    
    // Format the comprehensive response
    let finalResponse = `${aiResponse.answer}\n\n`;
    
    // Add recommendations if available
    if (aiResponse.recommendations.length > 0) {
      finalResponse += `**Recommendations:**\n`;
      aiResponse.recommendations.forEach((rec, index) => {
        finalResponse += `${index + 1}. ${rec}\n`;
      });
      finalResponse += '\n';
    }

    // Add urgency indicator
    if (aiResponse.urgency === 'emergency') {
      finalResponse += `⚠️ **URGENT**: This may require immediate veterinary attention!\n\n`;
    } else if (aiResponse.urgency === 'high') {
      finalResponse += `⚡ **Important**: Please consult a veterinarian soon.\n\n`;
    }

    // Add sources if available
    if (aiResponse.sources.length > 0) {
      finalResponse += `**Sources consulted:** ${aiResponse.sources.length} veterinary resources\n`;
    }

    // Add confidence indicator
    const confidenceEmoji = aiResponse.confidence > 0.8 ? '🎯' : aiResponse.confidence > 0.6 ? '📊' : '🔍';
    finalResponse += `${confidenceEmoji} **Confidence:** ${Math.round(aiResponse.confidence * 100)}%\n`;
    
    // Add reasoning for transparency
    if (aiResponse.reasoning) {
      finalResponse += `🧠 **Analysis:** ${aiResponse.reasoning}\n`;
    }

    return finalResponse;

  } catch (error) {
    console.error('Real AI service failed, falling back to traditional system:', error);
    return generateTraditionalVetAdvice(query, species);
  }
};

// Fallback to the traditional system if real AI fails
const generateTraditionalVetAdvice = async (query: string, species: PetSpecies): Promise<string> => {
  console.log('🔄 Using traditional AI system as fallback');
  
  try {
    // Detect language for traditional system
    const detectedLanguage = realVeterinaryTranslator.detectLanguage(query);
    
    // Use traditional symptom analysis
    const symptomAnalysis = analyzeSymptoms(query, species);
    
    // Generate treatment recommendations
    const recommendations = generateTreatmentRecommendations(
      query, 
      species, 
      symptomAnalysis, 
      detectedLanguage
    );
    
    // Format traditional response
    let response = `Based on the symptoms you've described for your ${species}, here's what I can tell you:\n\n`;
    
    response += `**Assessment:** ${recommendations.assessment}\n\n`;
    
    if (recommendations.possibleCauses.length > 0) {
      response += `**Possible causes:**\n`;
      recommendations.possibleCauses.forEach((cause, index) => {
        response += `${index + 1}. ${cause}\n`;
      });
      response += '\n';
    }
    
    if (recommendations.immediateActions.length > 0) {
      response += `**Immediate actions:**\n`;
      recommendations.immediateActions.forEach((action, index) => {
        response += `${index + 1}. ${action}\n`;
      });
      response += '\n';
    }
    
    if (recommendations.suggestedMedicines.length > 0) {
      response += `**Suggested treatments:**\n`;
      recommendations.suggestedMedicines.forEach((medicine, index) => {
        response += `${index + 1}. ${medicine}\n`;
      });
      response += '\n';
    }
    
    response += `**Urgency Level:** ${recommendations.urgencyLevel}\n\n`;
    response += `⚠️ **Important:** This is general guidance only. Please consult with a qualified veterinarian for proper diagnosis and treatment.\n`;
    response += `🔄 **System:** Traditional AI (Fallback Mode)`;
    
    return response;
    
  } catch (error) {
    console.error('Traditional AI system also failed:', error);
    return generateEmergencyFallback(query, species);
  }
};

// Emergency fallback for when all systems fail
const generateEmergencyFallback = (query: string, species: PetSpecies): string => {
  console.log('🆘 Using emergency fallback response');
  
  return `Thank you for your question about your ${species}. 

I'm currently experiencing technical difficulties with my AI systems, but I want to ensure you get the help you need.

**Immediate recommendations:**
1. If this is an emergency (difficulty breathing, severe bleeding, unconsciousness, seizures), contact an emergency veterinarian immediately
2. For non-emergency concerns, schedule an appointment with your regular veterinarian
3. Monitor your pet closely and note any changes in behavior, appetite, or symptoms
4. Ensure your pet has access to fresh water and a comfortable environment

**Emergency contacts:**
- Your local veterinary clinic
- Animal emergency services in your area
- Pet poison control hotline (if suspected poisoning)

I apologize for the technical difficulties. Your pet's health is important, and professional veterinary care is always the best option for proper diagnosis and treatment.

🔧 **System Status:** Emergency Fallback Mode - Please try again later for full AI assistance.`;
};

// Export configuration functions for advanced users
export const updateAIConfig = (newConfig: Partial<AIServiceConfig>): void => {
  realIntelligentVeterinaryAI.updateConfig(newConfig);
  console.log('🔧 AI Service configuration updated');
};

export const getAIStats = () => {
  const realStats = realIntelligentVeterinaryAI.getStats();
  const translatorStats = realVeterinaryTranslator.getTranslationStats();
  
  return {
    ...realStats,
    translation: translatorStats,
    mode: 'Real AI System',
    lastUpdate: new Date().toISOString()
  };
};

// Health check for the AI service
export const checkAIHealth = async (): Promise<{ status: string; details: any }> => {
  try {
    const testQuery = "test query";
    const testResponse = await realIntelligentVeterinaryAI.generateIntelligentResponse(
      testQuery, 
      'dog', 
      'en'
    );
    
    return {
      status: 'healthy',
      details: {
        confidence: testResponse.confidence,
        provider: AI_CONFIG.provider,
        stats: getAIStats()
      }
    };
  } catch (error) {
    return {
      status: 'degraded',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackAvailable: true
      }
    };
  }
};
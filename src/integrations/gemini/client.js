import { VertexAI } from '@google-cloud/vertexai';
import { config } from '../../config/index.js';
import logger from '../../utils/logger.js';

/**
 * Gemini API Client
 * Wraps Vertex AI SDK for multi-model Gemini access
 */
class GeminiClient {
  constructor() {
    this.vertexAI = new VertexAI({
      project: config.gcp.projectId,
      location: config.vertexAI.location
    });

    // Initialize models
    this.models = {
      pro: this.vertexAI.getGenerativeModel({ model: config.vertexAI.models.pro }),
      flash: this.vertexAI.getGenerativeModel({ model: config.vertexAI.models.flash }),
      embedding: this.vertexAI.getGenerativeModel({ model: config.vertexAI.models.embedding })
    };

    logger.info('Gemini client initialized', {
      project: config.gcp.projectId,
      location: config.vertexAI.location,
      models: Object.keys(this.models)
    });
  }

  /**
   * Generate content with Gemini 2.5 Pro (deep reasoning)
   */
  async generateWithPro(options) {
    const {
      systemInstruction,
      conversationHistory = [],
      userMessage,
      temperature = 0.7,
      maxOutputTokens = 2048,
      tools = null
    } = options;

    try {
      const contents = this._buildContents(conversationHistory, userMessage);
      
      const request = {
        contents,
        generationConfig: {
          temperature,
          maxOutputTokens,
          topP: 0.95
        }
      };

      if (systemInstruction) {
        request.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      if (tools) {
        request.tools = tools;
      }

      logger.debug('Gemini 2.5 Pro request', {
        messageCount: contents.length,
        temperature,
        maxOutputTokens,
        hasSystemInstruction: !!systemInstruction,
        hasTools: !!tools
      });

      const result = await this.models.pro.generateContent(request);
      const response = result.response;

      // Extract text from response candidates
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text || null;
      const functionCalls = response.candidates?.[0]?.content?.parts
        ?.filter(part => part.functionCall)
        .map(part => part.functionCall) || null;

      logger.info('Gemini 2.5 Pro response', {
        candidatesCount: response.candidates?.length,
        hasText: !!text,
        hasFunctionCall: !!(functionCalls && functionCalls.length > 0)
      });

      return {
        text,
        functionCalls,
        metadata: {
          model: config.vertexAI.models.pro,
          finishReason: response.candidates?.[0]?.finishReason,
          safetyRatings: response.candidates?.[0]?.safetyRatings
        }
      };

    } catch (error) {
      logger.error('Gemini 2.5 Pro error', { error: error.message, stack: error.stack });
      throw new Error(`Gemini Pro generation failed: ${error.message}`);
    }
  }

  /**
   * Generate content with Gemini 2.0 Flash (fast responses)
   */
  async generateWithFlash(options) {
    const {
      systemInstruction,
      userMessage,
      temperature = 0.5,
      maxOutputTokens = 512
    } = options;

    try {
      const contents = [{ role: 'user', parts: [{ text: userMessage }] }];
      
      const request = {
        contents,
        generationConfig: {
          temperature,
          maxOutputTokens
        }
      };

      if (systemInstruction) {
        request.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      logger.debug('Gemini 2.0 Flash request', {
        messageLength: userMessage.length,
        temperature,
        maxOutputTokens
      });

      const result = await this.models.flash.generateContent(request);
      const response = result.response;

      // Extract text from response candidates
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text || null;

      logger.info('Gemini 2.0 Flash response', {
        responseLength: text?.length
      });

      return {
        text,
        metadata: {
          model: config.vertexAI.models.flash,
          finishReason: response.candidates?.[0]?.finishReason
        }
      };

    } catch (error) {
      logger.error('Gemini 2.0 Flash error', { error: error.message });
      throw new Error(`Gemini Flash generation failed: ${error.message}`);
    }
  }

  /**
   * Generate embeddings for semantic matching
   */
  async generateEmbedding(text) {
    try {
      logger.debug('Gemini Embeddings request', {
        textLength: text.length
      });

      const result = await this.models.embedding.embedContent(text);
      const embedding = result.embeddings?.values || result.embedding?.values;

      if (!embedding) {
        throw new Error('No embedding values returned');
      }

      logger.info('Gemini Embeddings response', {
        dimension: embedding.length
      });

      return {
        embedding,
        metadata: {
          model: config.vertexAI.models.embedding,
          dimension: embedding.length
        }
      };

    } catch (error) {
      logger.error('Gemini Embeddings error', { error: error.message });
      throw new Error(`Gemini Embeddings generation failed: ${error.message}`);
    }
  }

  /**
   * Helper: Build conversation contents array
   */
  _buildContents(conversationHistory, userMessage) {
    const contents = [];

    // Add conversation history
    for (const turn of conversationHistory) {
      contents.push({
        role: turn.role,
        parts: [{ text: turn.content }]
      });
    }

    // Add current user message
    if (userMessage) {
      contents.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });
    }

    return contents;
  }

  /**
   * Calculate approximate token count (rough estimate)
   */
  estimateTokens(text) {
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4);
  }
}

// Singleton instance
const geminiClient = new GeminiClient();
export default geminiClient;

import geminiClient from '../../integrations/gemini/client.js';
import { PHOENIX_SYSTEM_PROMPT, ROUTING_FUNCTION_DECLARATIONS } from './prompts.js';
import atlasAgent from '../atlas/research.js';
import catalystAgent from '../catalyst/grants.js';
import ledgerAgent from '../ledger/modeling.js';
import pivotconnectAgent from '../pivotconnect/matching.js';
import logger from '../../utils/logger.js';

/**
 * Phoenix Orchestrator
 * Routes requests to specialized agents and provides strategic coaching
 */
class PhoenixOrchestrator {
  constructor() {
    this.agentMap = {
      route_to_atlas: atlasAgent,
      route_to_catalyst: catalystAgent,
      route_to_ledger: ledgerAgent,
      route_to_pivotconnect: pivotconnectAgent
    };
  }

  /**
   * Process user message through Phoenix
   */
  async processMessage(options) {
    const {
      userId,
      message,
      conversationHistory = [],
      useFlash = false // Set true for quick responses
    } = options;

    try {
      logger.info('Phoenix processing message', {
        userId,
        messageLength: message.length,
        historyLength: conversationHistory.length,
        useFlash
      });

      // Determine if routing needed (use function calling)
      const routingDecision = await this._determineRoute(message, conversationHistory);

      logger.info('Phoenix routing decision', {
        userId,
        decision: routingDecision.type,
        agent: routingDecision.agent
      });

      // Route to appropriate handler
      if (routingDecision.type === 'route' && routingDecision.agent) {
        return await this._handleAgentRoute(routingDecision, userId, message, conversationHistory);
      } else {
        return await this._provideDirectCoaching(userId, message, conversationHistory, useFlash);
      }

    } catch (error) {
      logger.error('Phoenix processing error', {
        userId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Determine routing decision using Gemini function calling
   */
  async _determineRoute(message, conversationHistory) {
    try {
      const result = await geminiClient.generateWithPro({
        systemInstruction: PHOENIX_SYSTEM_PROMPT,
        conversationHistory,
        userMessage: message,
        temperature: 0.5,
        maxOutputTokens: 1024,
        tools: [{
          functionDeclarations: ROUTING_FUNCTION_DECLARATIONS
        }]
      });

      // Check if Gemini returned a function call
      if (result.functionCalls && result.functionCalls.length > 0) {
        const functionCall = result.functionCalls[0];
        
        logger.info('Gemini function call', {
          functionName: functionCall.name,
          args: functionCall.args
        });

        // If it's provide_coaching, don't route
        if (functionCall.name === 'provide_coaching') {
          return {
            type: 'direct_coaching',
            agent: null,
            params: functionCall.args
          };
        }

        return {
          type: 'route',
          agent: functionCall.name,
          params: functionCall.args
        };
      }

      // No function call = direct coaching
      return {
        type: 'direct_coaching',
        agent: null,
        params: {}
      };

    } catch (error) {
      logger.error('Routing decision error', { error: error.message });
      // Default to direct coaching on error
      return {
        type: 'direct_coaching',
        agent: null,
        params: {}
      };
    }
  }

  /**
   * Route to specialized agent
   */
  async _handleAgentRoute(routingDecision, userId, message, conversationHistory) {
    const agent = this.agentMap[routingDecision.agent];
    
    if (!agent) {
      logger.warn('Unknown agent', { agent: routingDecision.agent });
      return await this._provideDirectCoaching(userId, message, conversationHistory);
    }

    logger.info('Routing to agent', {
      userId,
      agent: routingDecision.agent,
      params: routingDecision.params
    });

    try {
      // Call specialized agent
      const agentResult = await agent.execute({
        userId,
        params: routingDecision.params,
        context: {
          originalMessage: message,
          conversationHistory
        }
      });

      // Phoenix synthesizes agent result with user context
      const synthesis = await this._synthesizeAgentResult(
        agentResult,
        message,
        conversationHistory
      );

      return {
        agent: routingDecision.agent.replace('route_to_', ''),
        agentResult,
        synthesis,
        metadata: {
          routedAgent: routingDecision.agent,
          userId
        }
      };

    } catch (error) {
      logger.error('Agent execution error', {
        agent: routingDecision.agent,
        error: error.message
      });

      // Fallback to direct coaching
      return await this._provideDirectCoaching(
        userId,
        `I tried to get specialized help but encountered an issue. Let me help directly: ${message}`,
        conversationHistory
      );
    }
  }

  /**
   * Synthesize agent result back to user
   */
  async _synthesizeAgentResult(agentResult, originalMessage, conversationHistory) {
    const synthesisPrompt = `
The user asked: "${originalMessage}"

I delegated to a specialized agent, which returned:
${JSON.stringify(agentResult, null, 2)}

Your task: Synthesize this information into a conversational response for the entrepreneur. 
- Explain what you found/calculated
- Connect it to their specific situation
- Provide actionable next steps
- Be encouraging but realistic

Keep it conversational and actionable (300-500 words).`;

    const result = await geminiClient.generateWithPro({
      systemInstruction: PHOENIX_SYSTEM_PROMPT,
      conversationHistory,
      userMessage: synthesisPrompt,
      temperature: 0.7,
      maxOutputTokens: 2048
    });

    return result.text;
  }

  /**
   * Provide direct coaching without routing
   */
  async _provideDirectCoaching(userId, message, conversationHistory, useFlash = false) {
    logger.info('Phoenix direct coaching', {
      userId,
      useFlash,
      historyLength: conversationHistory.length
    });

    const result = useFlash
      ? await geminiClient.generateWithFlash({
          systemInstruction: PHOENIX_SYSTEM_PROMPT,
          userMessage: message,
          temperature: 0.6,
          maxOutputTokens: 512
        })
      : await geminiClient.generateWithPro({
          systemInstruction: PHOENIX_SYSTEM_PROMPT,
          conversationHistory,
          userMessage: message,
          temperature: 0.7,
          maxOutputTokens: 2048
        });

    return {
      agent: 'phoenix',
      response: result.text,
      metadata: {
        model: result.metadata.model,
        userId,
        type: 'direct_coaching'
      }
    };
  }
}

// Singleton instance
const phoenixOrchestrator = new PhoenixOrchestrator();
export default phoenixOrchestrator;

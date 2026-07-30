import geminiClient from '../../integrations/gemini/client.js';
import { CATALYST_SYSTEM_PROMPT } from './prompts.js';
import logger from '../../utils/logger.js';

/**
 * Catalyst Grant Matching Agent
 * Uses Gemini Embeddings for semantic grant search
 */
class CatalystAgent {
  async execute(options) {
    const { userId, params, context } = options;
    const { request_type, funding_amount, business_stage, special_categories = [] } = params;

    logger.info('Catalyst request started', {
      userId,
      request_type,
      funding_amount,
      business_stage
    });

    try {
      let result;

      switch (request_type) {
        case 'grant_search':
          result = await this._searchGrants({
            userId,
            funding_amount,
            business_stage,
            special_categories,
            context
          });
          break;

        case 'pitch_review':
          result = await this._reviewPitch({
            userId,
            context
          });
          break;

        case 'investor_matching':
          result = await this._matchInvestors({
            userId,
            context
          });
          break;

        case 'application_guidance':
          result = await this._provideApplicationGuidance({
            userId,
            context
          });
          break;

        default:
          throw new Error(`Unknown request type: ${request_type}`);
      }

      logger.info('Catalyst request completed', {
        userId,
        request_type
      });

      return {
        request_type,
        ...result,
        timestamp: new Date().toISOString(),
        metadata: {
          agent: 'catalyst',
          userId
        }
      };

    } catch (error) {
      logger.error('Catalyst request error', {
        userId,
        request_type,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Search for matching grants using embeddings
   */
  async _searchGrants(options) {
    const { userId, funding_amount, business_stage, special_categories, context } = options;

    // Build entrepreneur profile for semantic matching
    const profileText = this._buildProfileText({
      funding_amount,
      business_stage,
      special_categories,
      businessContext: context?.originalMessage
    });

    logger.debug('Catalyst profile', { userId, profileText });

    // Generate embedding for entrepreneur profile
    const { embedding } = await geminiClient.generateEmbedding(profileText);

    // In production, this would search vector database
    // For now, use Gemini to simulate grant matching
    const matchQuery = `
Find grant opportunities for this entrepreneur profile:

${profileText}

Identify 3-5 matching grants with:
1. Grant name and organization
2. Amount available
3. Fit score (0-100%)
4. Why it's a good match
5. Application deadline
6. Key requirements

Format as a structured list.`;

    const result = await geminiClient.generateWithPro({
      systemInstruction: CATALYST_SYSTEM_PROMPT,
      userMessage: matchQuery,
      temperature: 0.5,
      maxOutputTokens: 2048
    });

    return {
      profile: profileText,
      matches: result.text,
      embedding_dimension: embedding.length
    };
  }

  /**
   * Review pitch deck or application
   */
  async _reviewPitch(options) {
    const { userId, context } = options;

    const reviewQuery = `
Review this pitch/application:

${context?.originalMessage || 'No pitch content provided'}

Assess:
1. Problem clarity
2. Solution uniqueness
3. Market opportunity
4. Team credibility
5. Financial projections
6. Impact measurement

Provide specific, actionable feedback for improvement.`;

    const result = await geminiClient.generateWithPro({
      systemInstruction: CATALYST_SYSTEM_PROMPT,
      userMessage: reviewQuery,
      temperature: 0.6,
      maxOutputTokens: 2048
    });

    return {
      review: result.text
    };
  }

  /**
   * Match with investors
   */
  async _matchInvestors(options) {
    const { userId, context } = options;

    const matchQuery = `
Based on this business profile:

${context?.originalMessage || 'No business context provided'}

Identify 3-5 investor types/firms that would be good matches:
1. Investor name/type
2. Investment thesis
3. Typical check size
4. Why they'd be interested
5. Warm intro strategy`;

    const result = await geminiClient.generateWithPro({
      systemInstruction: CATALYST_SYSTEM_PROMPT,
      userMessage: matchQuery,
      temperature: 0.6,
      maxOutputTokens: 2048
    });

    return {
      matches: result.text
    };
  }

  /**
   * Provide application guidance
   */
  async _provideApplicationGuidance(options) {
    const { userId, context } = options;

    const guidanceQuery = `
The entrepreneur needs application guidance for:

${context?.originalMessage || 'No context provided'}

Provide:
1. Application strategy (which grants to prioritize)
2. Key elements to emphasize
3. Common mistakes to avoid
4. Timeline recommendations
5. Success rate optimization tips`;

    const result = await geminiClient.generateWithPro({
      systemInstruction: CATALYST_SYSTEM_PROMPT,
      userMessage: guidanceQuery,
      temperature: 0.6,
      maxOutputTokens: 2048
    });

    return {
      guidance: result.text
    };
  }

  /**
   * Build profile text for semantic matching
   */
  _buildProfileText(options) {
    const { funding_amount, business_stage, special_categories, businessContext } = options;

    let profile = [];

    if (funding_amount) {
      profile.push(`Funding need: $${funding_amount.toLocaleString()}`);
    }

    if (business_stage) {
      profile.push(`Business stage: ${business_stage}`);
    }

    if (special_categories && special_categories.length > 0) {
      profile.push(`Special categories: ${special_categories.join(', ')}`);
    }

    if (businessContext) {
      profile.push(`Business context: ${businessContext}`);
    }

    return profile.join('\n');
  }
}

// Singleton instance
const catalystAgent = new CatalystAgent();
export default catalystAgent;

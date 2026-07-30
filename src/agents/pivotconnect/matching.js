import geminiClient from '../../integrations/gemini/client.js';
import { PIVOTCONNECT_SYSTEM_PROMPT } from './prompts.js';
import logger from '../../utils/logger.js';

/**
 * PivotConnect Matching Agent
 * Uses Gemini Embeddings for semantic mentor/investor matching
 */
class PivotConnectAgent {
  async execute(options) {
    const { userId, params, context } = options;
    const { match_type, expertise_needed = [], industry, challenge } = params;

    logger.info('PivotConnect matching started', {
      userId,
      match_type,
      expertise_needed,
      industry
    });

    try {
      // Build entrepreneur need profile
      const needProfile = this._buildNeedProfile({
        match_type,
        expertise_needed,
        industry,
        challenge,
        context
      });

      // Generate embedding for need profile
      const { embedding } = await geminiClient.generateEmbedding(needProfile);

      logger.debug('PivotConnect need profile', {
        userId,
        needProfile,
        embedding_dimension: embedding.length
      });

      // Find matches (in production, this searches vector database)
      // For now, use Gemini to simulate matching
      const matches = await this._findMatches(needProfile, match_type);

      // Generate introduction message for top match
      const introduction = await this._generateIntroduction(needProfile, matches, match_type);

      logger.info('PivotConnect matching completed', {
        userId,
        match_type,
        matches_found: matches.length
      });

      return {
        match_type,
        need_profile: needProfile,
        matches: matches,
        introduction: introduction,
        embedding_dimension: embedding.length,
        timestamp: new Date().toISOString(),
        metadata: {
          agent: 'pivotconnect',
          userId
        }
      };

    } catch (error) {
      logger.error('PivotConnect matching error', {
        userId,
        match_type,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Build entrepreneur need profile for semantic matching
   */
  _buildNeedProfile(options) {
    const { match_type, expertise_needed, industry, challenge, context } = options;

    let profile = [];

    profile.push(`Looking for: ${match_type}`);

    if (industry) {
      profile.push(`Industry: ${industry}`);
    }

    if (expertise_needed && expertise_needed.length > 0) {
      profile.push(`Expertise needed: ${expertise_needed.join(', ')}`);
    }

    if (challenge) {
      profile.push(`Specific challenge: ${challenge}`);
    }

    if (context?.originalMessage) {
      profile.push(`Context: ${context.originalMessage}`);
    }

    return profile.join('\n');
  }

  /**
   * Find matching mentors/investors
   */
  async _findMatches(needProfile, matchType) {
    const matchQuery = `
Find 3-5 ${matchType}s who would be excellent matches for this entrepreneur:

${needProfile}

For each match, provide:
1. Name (or type of person to find)
2. Relevant experience/expertise
3. Why they're a great fit (be specific)
4. Match score (0-100%)

Prioritize specificity over generality.`;

    const result = await geminiClient.generateWithFlash({
      systemInstruction: PIVOTCONNECT_SYSTEM_PROMPT,
      userMessage: matchQuery,
      temperature: 0.6,
      maxOutputTokens: 1024
    });

    return result.text;
  }

  /**
   * Generate personalized introduction message
   */
  async _generateIntroduction(needProfile, matches, matchType) {
    const introQuery = `
Generate a personalized introduction email connecting this entrepreneur with the top ${matchType} match.

**Entrepreneur Profile:**
${needProfile}

**Match Information:**
${matches}

Write a warm, professional introduction that:
1. Explains why this connection makes sense
2. Highlights specific alignment (not generic)
3. Suggests a 30-minute call
4. Respects the ${matchType}'s time

Keep it concise (200-300 words).`;

    const result = await geminiClient.generateWithFlash({
      systemInstruction: PIVOTCONNECT_SYSTEM_PROMPT,
      userMessage: introQuery,
      temperature: 0.7,
      maxOutputTokens: 512
    });

    return result.text;
  }

  /**
   * Calculate semantic similarity between profiles
   * (Production: use vector cosine similarity)
   */
  async _calculateSimilarity(entrepreneurEmbedding, mentorEmbedding) {
    // Cosine similarity
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < entrepreneurEmbedding.length; i++) {
      dotProduct += entrepreneurEmbedding[i] * mentorEmbedding[i];
      magnitudeA += entrepreneurEmbedding[i] ** 2;
      magnitudeB += mentorEmbedding[i] ** 2;
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    return dotProduct / (magnitudeA * magnitudeB);
  }
}

// Singleton instance
const pivotconnectAgent = new PivotConnectAgent();
export default pivotconnectAgent;

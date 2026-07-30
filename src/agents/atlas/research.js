import geminiClient from '../../integrations/gemini/client.js';
import { ATLAS_SYSTEM_PROMPT } from './prompts.js';
import logger from '../../utils/logger.js';
import axios from 'axios';

/**
 * Atlas Research Agent
 * Conducts market research using Gemini + web search
 */
class AtlasAgent {
  async execute(options) {
    const { userId, params, context } = options;
    const { research_type, industry, focus_areas = [], context: businessContext } = params;

    logger.info('Atlas research started', {
      userId,
      research_type,
      industry,
      focus_areas
    });

    try {
      // Build research query
      const researchQuery = this._buildResearchQuery(research_type, industry, focus_areas, businessContext);

      // Conduct research (Gemini handles web search via grounding)
      const researchReport = await this._conductResearch(researchQuery, research_type);

      logger.info('Atlas research completed', {
        userId,
        research_type,
        reportLength: researchReport.length
      });

      return {
        research_type,
        industry,
        focus_areas,
        report: researchReport,
        timestamp: new Date().toISOString(),
        metadata: {
          agent: 'atlas',
          userId
        }
      };

    } catch (error) {
      logger.error('Atlas research error', {
        userId,
        research_type,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Build research query based on type and parameters
   */
  _buildResearchQuery(researchType, industry, focusAreas, businessContext) {
    const queries = {
      competitive_analysis: `Conduct competitive analysis for ${industry}. Identify top competitors, their positioning, pricing strategies, strengths and weaknesses. Focus on: ${focusAreas.join(', ')}.`,
      
      market_sizing: `Calculate total addressable market (TAM), serviceable addressable market (SAM), and serviceable obtainable market (SOM) for ${industry}. Include market size in USD, growth rate (CAGR), key segments, and geographic distribution.`,
      
      customer_personas: `Develop detailed customer personas for ${industry}. Include demographics, psychographics, behaviors, pain points, buying triggers, and decision-making process.`,
      
      industry_trends: `Identify emerging trends, opportunities, and threats in ${industry}. Focus on technological shifts, regulatory changes, competitive dynamics, and market evolution.`,
      
      regulatory_research: `Map regulatory and compliance requirements for ${industry}. Include federal/state regulations, industry-specific certifications, legal structures, and compliance costs.`
    };

    let query = queries[researchType] || queries.competitive_analysis;

    if (businessContext) {
      query += `\n\nBusiness context: ${businessContext}`;
    }

    if (focusAreas.length > 0) {
      query += `\n\nPay special attention to: ${focusAreas.join(', ')}`;
    }

    return query;
  }

  /**
   * Conduct research using Gemini with web grounding
   */
  async _conductResearch(query, researchType) {
    // Use Gemini 2.5 Pro with extended context for synthesis
    const result = await geminiClient.generateWithPro({
      systemInstruction: ATLAS_SYSTEM_PROMPT,
      userMessage: query,
      temperature: 0.5, // Lower temperature for factual accuracy
      maxOutputTokens: 4096 // Allow longer research reports
    });

    return result.text;
  }

  /**
   * Parse research report into structured data
   */
  _parseReport(reportText) {
    // Extract key sections
    const sections = {
      executive_summary: this._extractSection(reportText, 'Executive Summary'),
      market_overview: this._extractSection(reportText, 'Market Overview'),
      competitive_landscape: this._extractSection(reportText, 'Competitive Landscape'),
      recommendations: this._extractSection(reportText, 'Recommendations'),
      citations: this._extractCitations(reportText)
    };

    return sections;
  }

  /**
   * Extract section from report
   */
  _extractSection(text, sectionName) {
    const regex = new RegExp(`###\\s*${sectionName}([\\s\\S]*?)(?=###|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  }

  /**
   * Extract citations from report
   */
  _extractCitations(text) {
    const urlRegex = /https?:\/\/[^\s)]+/g;
    const urls = text.match(urlRegex);
    return urls ? [...new Set(urls)] : [];
  }
}

// Singleton instance
const atlasAgent = new AtlasAgent();
export default atlasAgent;

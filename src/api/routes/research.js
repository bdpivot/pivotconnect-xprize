import express from 'express';
import atlasAgent from '../../agents/atlas/research.js';
import logger from '../../utils/logger.js';

const router = express.Router();

/**
 * POST /api/research
 * Request market research from Atlas
 */
router.post('/', async (req, res) => {
  try {
    const { userId, research_type, industry, focus_areas = [], context } = req.body;

    // Validation
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    if (!research_type) {
      return res.status(400).json({ error: 'research_type is required' });
    }
    if (!industry) {
      return res.status(400).json({ error: 'industry is required' });
    }

    logger.info('Research request received', {
      userId,
      research_type,
      industry
    });

    // Execute Atlas research
    const result = await atlasAgent.execute({
      userId,
      params: {
        research_type,
        industry,
        focus_areas,
        context
      },
      context: {}
    });

    logger.info('Research request completed', {
      userId,
      research_type,
      reportLength: result.report?.length
    });

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    logger.error('Research request error', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;

import express from 'express';
import pivotconnectAgent from '../../agents/pivotconnect/matching.js';
import logger from '../../utils/logger.js';

const router = express.Router();

/**
 * POST /api/mentors
 * Request mentor matching from PivotConnect
 */
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      match_type,
      expertise_needed = [],
      industry,
      challenge
    } = req.body;

    // Validation
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    if (!match_type) {
      return res.status(400).json({ error: 'match_type is required' });
    }
    if (!expertise_needed || expertise_needed.length === 0) {
      return res.status(400).json({ error: 'expertise_needed is required' });
    }

    logger.info('Mentor matching request received', {
      userId,
      match_type,
      industry
    });

    // Execute PivotConnect
    const result = await pivotconnectAgent.execute({
      userId,
      params: {
        match_type,
        expertise_needed,
        industry,
        challenge
      },
      context: {}
    });

    logger.info('Mentor matching completed', {
      userId,
      match_type
    });

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    logger.error('Mentor matching error', {
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

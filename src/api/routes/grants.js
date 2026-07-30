import express from 'express';
import catalystAgent from '../../agents/catalyst/grants.js';
import logger from '../../utils/logger.js';

const router = express.Router();

/**
 * POST /api/grants
 * Request grant matching from Catalyst
 */
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      request_type,
      funding_amount,
      business_stage,
      special_categories = []
    } = req.body;

    // Validation
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    if (!request_type) {
      return res.status(400).json({ error: 'request_type is required' });
    }

    logger.info('Grant request received', {
      userId,
      request_type,
      funding_amount
    });

    // Execute Catalyst
    const result = await catalystAgent.execute({
      userId,
      params: {
        request_type,
        funding_amount,
        business_stage,
        special_categories
      },
      context: {}
    });

    logger.info('Grant request completed', {
      userId,
      request_type
    });

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    logger.error('Grant request error', {
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

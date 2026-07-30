import express from 'express';
import ledgerAgent from '../../agents/ledger/modeling.js';
import logger from '../../utils/logger.js';

const router = express.Router();

/**
 * POST /api/financial
 * Request financial modeling from Ledger
 */
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      model_type,
      current_financials = {},
      scenario_variables = {}
    } = req.body;

    // Validation
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    if (!model_type) {
      return res.status(400).json({ error: 'model_type is required' });
    }

    logger.info('Financial modeling request received', {
      userId,
      model_type
    });

    // Execute Ledger
    const result = await ledgerAgent.execute({
      userId,
      params: {
        model_type,
        current_financials,
        scenario_variables
      },
      context: {}
    });

    logger.info('Financial modeling completed', {
      userId,
      model_type
    });

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    logger.error('Financial modeling error', {
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

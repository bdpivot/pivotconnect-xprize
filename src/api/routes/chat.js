import express from 'express';
import phoenixOrchestrator from '../../agents/phoenix/orchestrator.js';
import logger from '../../utils/logger.js';

const router = express.Router();

/**
 * POST /api/chat
 * Main entry point for Phoenix conversations
 */
router.post('/', async (req, res) => {
  try {
    const { userId, message, conversationHistory = [], useFlash = false } = req.body;

    // Validation
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    logger.info('Chat request received', {
      userId,
      messageLength: message.length,
      historyLength: conversationHistory.length
    });

    // Process through Phoenix
    const result = await phoenixOrchestrator.processMessage({
      userId,
      message,
      conversationHistory,
      useFlash
    });

    logger.info('Chat request completed', {
      userId,
      agent: result.agent,
      routed: !!result.agentResult
    });

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    logger.error('Chat request error', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/chat/history/:userId
 * Retrieve conversation history for user
 */
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    // TODO: Implement database query
    // For now, return empty array
    res.json({
      success: true,
      userId,
      conversations: [],
      limit: parseInt(limit)
    });

  } catch (error) {
    logger.error('History retrieval error', {
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;

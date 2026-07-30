import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';
import chatRouter from './routes/chat.js';
import researchRouter from './routes/research.js';
import grantsRouter from './routes/grants.js';
import financialRouter from './routes/financial.js';
import mentorsRouter from './routes/mentors.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.server.env
  });
});

// API Routes
app.use('/api/chat', chatRouter);
app.use('/api/research', researchRouter);
app.use('/api/grants', grantsRouter);
app.use('/api/financial', financialRouter);
app.use('/api/mentors', mentorsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'LaunchPad AI',
    description: 'Multi-agent AI entrepreneurship support system',
    version: '1.0.0',
    agents: ['Phoenix', 'Atlas', 'Catalyst', 'Ledger', 'PivotConnect'],
    endpoints: {
      health: '/health',
      chat: '/api/chat',
      research: '/api/research',
      grants: '/api/grants',
      financial: '/api/financial',
      mentors: '/api/mentors'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Server error', {
    error: err.message,
    stack: err.stack,
    path: req.path
  });

  res.status(500).json({
    error: 'Internal server error',
    message: config.server.env === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  logger.info(`LaunchPad AI server started`, {
    port: PORT,
    environment: config.server.env,
    project: config.gcp.projectId
  });
});

export default app;

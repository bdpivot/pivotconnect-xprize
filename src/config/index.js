import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // Google Cloud
  gcp: {
    projectId: process.env.GCP_PROJECT_ID || 'phi-openclaw',
    region: process.env.GCP_REGION || 'us-central1',
    credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  },

  // Vertex AI
  vertexAI: {
    projectId: process.env.GCP_PROJECT_ID || 'phi-openclaw',
    location: process.env.VERTEX_AI_LOCATION || 'us-central1',
    models: {
      pro: 'gemini-2.5-pro',
      flash: 'gemini-2.5-flash',
      embedding: 'text-embedding-004'
    }
  },

  // Airtable
  airtable: {
    apiKey: process.env.AIRTABLE_API_KEY,
    baseId: process.env.AIRTABLE_BASE_ID,
    tables: {
      users: process.env.AIRTABLE_USERS_TABLE || 'Users',
      conversations: process.env.AIRTABLE_CONVERSATIONS_TABLE || 'Conversations',
      mentors: process.env.AIRTABLE_MENTORS_TABLE || 'Mentors',
      grants: process.env.AIRTABLE_GRANTS_TABLE || 'Grants'
    }
  },

  // Cloud SQL
  database: {
    url: process.env.DATABASE_URL
  },

  // API Server
  server: {
    port: parseInt(process.env.PORT || '8080', 10),
    env: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info'
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
  },

  // OpenClaw Integration
  openclaw: {
    gatewayUrl: process.env.OPENCLAW_GATEWAY_URL,
    token: process.env.OPENCLAW_TOKEN
  }
};

export default config;

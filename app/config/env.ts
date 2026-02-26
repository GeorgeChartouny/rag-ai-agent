/**
 * Environment configuration. Load and validate env vars here.
 */
import 'dotenv/config';

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  openaiApiKey: process.env.OPENAI_API_KEY ?? '',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? '',
  pineconeApiKey: process.env.PINECONE_API_KEY ?? '',
  pineconeIndex: process.env.PINECONE_INDEX ?? '',
  pineconeEnvironment: process.env.PINECONE_ENVIRONMENT ?? '',
  vectorStorePath: process.env.VECTOR_STORE_PATH ?? './data/vectorstore',
  uploadsDir: process.env.UPLOADS_DIR ?? './data/uploads',
  langsmithTracing: process.env.LANGSMITH_TRACING === 'true',
  langsmithApiKey: process.env.LANGSMITH_API_KEY ?? '',
  langsmithProject: process.env.LANGSMITH_PROJECT ?? '',
  port: parseInt(process.env.PORT ?? '3000', 10),
} as const;

/**
 * Environment configuration. Load and validate env vars here.
 */
import 'dotenv/config';

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  openaiApiKey: process.env.OPENAI_API_KEY ?? '',
  openaiEmbeddingModel: process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small',
  openaiEmbeddingDimensions: parseInt(
    process.env.OPENAI_EMBEDDING_DIMENSIONS ?? '1536',
    10
  ),
  openaiModel: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
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
  /** Minimum similarity score (0–1) for a chunk to be included in response sources. Chunks below this are omitted. */
  ragMinSourceScore: parseFloat(process.env.RAG_MIN_SOURCE_SCORE ?? '0.5'),
} as const;

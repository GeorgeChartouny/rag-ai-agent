/**
 * RAG AI Agent - Entry point.
 * Run with: npm start
 */
import 'dotenv/config';
import express from 'express';
import { initLangSmith } from './observability/langsmith';
import { compose } from './composition';
import { createUploadRouter } from './routes/upload';
import { createChatRouter } from './routes/chat';
import { createRetrievalRunner } from './chains/retrievalChain';
import { createRagAgent } from './agents/ragAgent';
import { env } from './config/env';

function main(): void {
  initLangSmith();

  const deps = compose();
  const retrievalRunner = createRetrievalRunner(
    deps.embedder,
    deps.vectorStore,
    deps.indexName
  );
  const invokeRagAgent = createRagAgent(retrievalRunner, deps.llm);

  const app = express();
  app.use(express.json());

  app.use(
    '/upload',
    createUploadRouter({
      embedder: deps.embedder,
      vectorStore: deps.vectorStore,
      indexName: deps.indexName,
    })
  );
  app.use('/chat', createChatRouter({ invokeRagAgent }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.listen(env.port, () => {
    console.log('RAG AI Agent');
    console.log('------------');
    console.log(`Server listening on http://localhost:${env.port}`);
    console.log('  POST /upload  - upload PDF');
    console.log('  POST /chat   - send message, get RAG response');
    console.log('  GET  /health - health check');
  });
}

main();

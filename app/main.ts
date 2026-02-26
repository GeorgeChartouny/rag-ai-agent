/**
 * RAG AI Agent - Entry point.
 * Run with: npm start
 */
import 'dotenv/config';
import express from 'express';
import { initLangSmith } from './observability/langsmith';
import uploadRouter from './routes/upload';
import chatRouter from './routes/chat';
import { env } from './config/env';

function main(): void {
  initLangSmith();

  const app = express();
  app.use(express.json());

  app.use('/upload', uploadRouter);
  app.use('/chat', chatRouter);

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

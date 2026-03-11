/**
 * Phase 4: Chat/LLM test. RAG agent returns non-placeholder answer when LLM is wired.
 * Uses stub vector store so we only test LLM wiring (no Pinecone dimension dependency).
 */
import 'dotenv/config';
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createOpenAIEmbedder } from '../app/embeddings/openaiEmbedder';
import { createStubVectorStore } from '../app/vectorstore/stubVectorStore';
import { createOpenAILlm } from '../app/llm/openaiLlm';
import { env } from '../app/config/env';
import { createRetrievalRunner } from '../app/chains/retrievalChain';
import { createRagAgent } from '../app/agents/ragAgent';

const hasOpenAI = Boolean(env.openaiApiKey);

describe('chat / RAG agent (Phase 4)', () => {
  it(
    'invokeRagAgent returns non-placeholder answer when LLM is wired',
    { skip: !hasOpenAI },
    async () => {
      const embedder = createOpenAIEmbedder({
        apiKey: env.openaiApiKey,
        model: env.openaiEmbeddingModel,
        dimensions: env.openaiEmbeddingDimensions,
      });
      const vectorStore = createStubVectorStore();
      const llm = createOpenAILlm({ apiKey: env.openaiApiKey, model: env.openaiModel });
      const indexName = env.pineconeIndex || 'test-index';

      const retrievalRunner = createRetrievalRunner(embedder, vectorStore, indexName);
      const invokeRagAgent = createRagAgent(retrievalRunner, llm);

      const result = await invokeRagAgent('What is 2 + 2?', 3);

      assert.ok(result.answer.length > 0, 'answer should be non-empty');
      assert.notStrictEqual(
        result.answer,
        '[LLM not wired yet]',
        'answer should not be the placeholder'
      );
      assert.ok(
        result.sources === undefined || Array.isArray(result.sources),
        'sources should be undefined or an array'
      );
    }
  );

  it(
    'when context is empty, returns answer (system prompt instructs to say if context insufficient)',
    { skip: !hasOpenAI },
    async () => {
      const embedder = createOpenAIEmbedder({
        apiKey: env.openaiApiKey,
        model: env.openaiEmbeddingModel,
        dimensions: env.openaiEmbeddingDimensions,
      });
      const vectorStore = createStubVectorStore();
      const llm = createOpenAILlm({ apiKey: env.openaiApiKey, model: env.openaiModel });
      const indexName = env.pineconeIndex || 'test-index';

      const retrievalRunner = createRetrievalRunner(embedder, vectorStore, indexName);
      const invokeRagAgent = createRagAgent(retrievalRunner, llm);

      const result = await invokeRagAgent(
        'What is the exact revenue of Acme Corp in Q3 2099?',
        3
      );

      assert.ok(result.answer.length > 0, 'answer should be non-empty');
      assert.notStrictEqual(
        result.answer,
        '[LLM not wired yet]',
        'answer should not be the placeholder'
      );
    }
  );
});

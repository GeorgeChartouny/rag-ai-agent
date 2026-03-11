/**
 * Composition root: build and wire dependencies for the RAG app.
 */
import { env } from './config/env';
import type { IEmbedder, ILLM, IVectorStore } from './abstractions';
import { createOpenAIEmbedder } from './embeddings/openaiEmbedder';
import { createPineconeVectorStore } from './vectorstore/pineconeClient';
import { createStubVectorStore } from './vectorstore/stubVectorStore';
import { createOpenAILlm } from './llm/openaiLlm';
import { createStubLlm } from './llm/stubLlm';

export interface AppDeps {
  embedder: IEmbedder;
  vectorStore: IVectorStore;
  llm: ILLM;
  indexName: string;
}

export function compose(): AppDeps {
  const embedder = createOpenAIEmbedder({
    apiKey: env.openaiApiKey,
    model: env.openaiEmbeddingModel,
    dimensions: env.openaiEmbeddingDimensions,
  });

  const vectorStore =
    env.pineconeApiKey && env.pineconeIndex
      ? createPineconeVectorStore({
          apiKey: env.pineconeApiKey,
          indexName: env.pineconeIndex,
          environment: env.pineconeEnvironment || undefined,
        })
      : createStubVectorStore();

  const llm =
    env.openaiApiKey
      ? createOpenAILlm({
          apiKey: env.openaiApiKey,
          model: env.openaiModel,
        })
      : createStubLlm();
  const indexName = env.pineconeIndex;

  return { embedder, vectorStore, llm, indexName };
}

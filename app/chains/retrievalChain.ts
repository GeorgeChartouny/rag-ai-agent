/**
 * Retrieval chain: query → embed → vector search → top-k chunks.
 * Dependencies are injected (embedder, vectorStore, indexName).
 */
import type { IEmbedder, IVectorStore } from '../abstractions';

export interface RetrievalResult {
  chunks: Array<{ text: string; score?: number; metadata?: Record<string, unknown> }>;
}

export type RetrievalRunner = (query: string, topK: number) => Promise<RetrievalResult>;

export async function runRetrievalChain(
  embedder: IEmbedder,
  vectorStore: IVectorStore,
  indexName: string,
  query: string,
  topK: number = 5
): Promise<RetrievalResult> {
  const queryVector = await embedder.embedText(query);
  const hits = await vectorStore.query(indexName, queryVector, topK);
  const chunks = hits.map((h) => ({
    text: (h.metadata?.text as string) ?? '',
    score: h.score,
    metadata: h.metadata,
  }));
  return { chunks };
}

export function createRetrievalRunner(
  embedder: IEmbedder,
  vectorStore: IVectorStore,
  indexName: string
): RetrievalRunner {
  return (query: string, topK: number = 5) =>
    runRetrievalChain(embedder, vectorStore, indexName, query, topK);
}

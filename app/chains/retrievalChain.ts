/**
 * Retrieval chain: query → embed → vector search → top-k chunks.
 */

import { embedText } from '../embeddings/embedder';
import { queryVectors } from '../vectorstore/pineconeClient';
import { env } from '../config/env';

export interface RetrievalResult {
  chunks: Array<{ text: string; score?: number; metadata?: Record<string, unknown> }>;
}

export async function runRetrievalChain(
  query: string,
  topK: number = 5
): Promise<RetrievalResult> {
  const queryVector = await embedText(query);
  const hits = await queryVectors(env.pineconeIndex, queryVector, topK);
  const chunks = hits.map((h) => ({
    text: (h.metadata?.text as string) ?? '',
    score: h.score,
    metadata: h.metadata,
  }));
  return { chunks };
}

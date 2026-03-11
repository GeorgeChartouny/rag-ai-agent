/**
 * Pinecone vector store client. Index and query vectors.
 * Exposes getPineconeClient and createPineconeVectorStore (IVectorStore implementation).
 */
import { Pinecone } from '@pinecone-database/pinecone';
import type { IVectorStore, VectorHit, VectorRecord } from '../abstractions';

export interface PineconeClientConfig {
  apiKey: string;
  indexName: string;
  environment?: string;
}

let clientInstance: Pinecone | null = null;

export function getPineconeClient(config: PineconeClientConfig): Pinecone {
  if (!clientInstance) {
    clientInstance = new Pinecone({ apiKey: config.apiKey });
  }
  return clientInstance;
}

/**
 * Returns an IVectorStore implementation backed by Pinecone.
 * Uses index name from config; the underlying client may need describeIndex for host in some setups.
 */
export function createPineconeVectorStore(config: PineconeClientConfig): IVectorStore {
  const pc = getPineconeClient(config);
  const indexName = config.indexName;

  return {
    async upsert(_indexName: string, vectors: VectorRecord[]): Promise<void> {
      if (vectors.length === 0) return;
      const index = pc.index({ name: indexName });
      await index.upsert({
        records: vectors.map((v) => ({
          id: v.id,
          values: v.values,
          metadata: v.metadata as Record<string, string | number | boolean | string[]> | undefined,
        })),
      });
    },

    async query(
      _indexName: string,
      queryVector: number[],
      topK: number = 5
    ): Promise<VectorHit[]> {
      const index = pc.index({ name: indexName });
      const response = await index.query({
        vector: queryVector,
        topK,
        includeMetadata: true,
      });
      const matches = response.matches ?? [];
      return matches.map((m) => ({
        id: m.id ?? '',
        score: typeof m.score === 'number' ? m.score : undefined,
        metadata: (m.metadata as Record<string, unknown>) ?? undefined,
      }));
    },
  };
}

/**
 * Stub vector store for Phase 1. Implements IVectorStore with no-op upsert and empty query results.
 */
import type { IVectorStore, VectorHit, VectorRecord } from '../abstractions';

export function createStubVectorStore(): IVectorStore {
  return {
    async query(_indexName: string, _vector: number[], _topK: number): Promise<VectorHit[]> {
      return [];
    },
    async upsert(_indexName: string, _vectors: VectorRecord[]): Promise<void> {
      // no-op
    },
  };
}

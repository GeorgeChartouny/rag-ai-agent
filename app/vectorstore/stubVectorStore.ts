/**
 * Stub vector store for Phase 1. Implements IVectorStore with no-op upsert and empty query results.
 */
import type { IVectorStore, VectorRecord } from '../abstractions';

export function createStubVectorStore(): IVectorStore {
  return {
    async query(): Promise<Array<{ id: string; score?: number; metadata?: Record<string, unknown> }>> {
      return [];
    },
    async upsert(_indexName: string, _vectors: VectorRecord[]): Promise<void> {
      // no-op
    },
  };
}

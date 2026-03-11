/**
 * Abstractions for RAG components. Used for dependency injection.
 */

export interface IEmbedder {
  embedText(text: string): Promise<number[]>;
  embedDocuments(texts: string[]): Promise<number[][]>;
}

export interface VectorHit {
  id: string;
  score?: number;
  metadata?: Record<string, unknown>;
}

export interface VectorRecord {
  id: string;
  values: number[];
  metadata?: Record<string, unknown>;
}

export interface IVectorStore {
  query(
    indexName: string,
    vector: number[],
    topK: number
  ): Promise<VectorHit[]>;
  upsert(indexName: string, vectors: VectorRecord[]): Promise<void>;
}

export type MessageRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface ILLM {
  generate(messages: ChatMessage[]): Promise<string>;
}

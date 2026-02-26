/**
 * Embedding model wrapper. Encodes text for vector store indexing and query.
 */

export interface EmbedderOptions {
  model?: string;
  dimensions?: number;
}

export async function embedText(text: string, _options?: EmbedderOptions): Promise<number[]> {
  // TODO: wire to OpenAI (or other) embedding model
  // Placeholder: return empty vector for now
  return [];
}

export async function embedDocuments(texts: string[], _options?: EmbedderOptions): Promise<number[][]> {
  // TODO: batch embed for ingestion
  return texts.map(() => []);
}

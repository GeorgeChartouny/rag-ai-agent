/**
 * OpenAI embedding implementation. Implements IEmbedder using text-embedding-3-small.
 */
import OpenAI from 'openai';
import type { IEmbedder } from '../abstractions';
import { env } from '../config/env';

export interface OpenAIEmbedderConfig {
  apiKey: string;
  model?: string;
  dimensions?: number;
}

export function createOpenAIEmbedder(config?: Partial<OpenAIEmbedderConfig>): IEmbedder {
  const apiKey = config?.apiKey ?? env.openaiApiKey;
  const model = config?.model ?? env.openaiEmbeddingModel;
  const dimensions = config?.dimensions ?? env.openaiEmbeddingDimensions;
  const client = new OpenAI({ apiKey });

  return {
    async embedText(text: string): Promise<number[]> {
      const res = await client.embeddings.create({
        model,
        input: text,
        dimensions,
      });
      const values = res.data[0]?.embedding;
      if (!values || !Array.isArray(values)) {
        throw new Error('OpenAI embeddings returned no vector');
      }
      return values as number[];
    },

    async embedDocuments(texts: string[]): Promise<number[][]> {
      if (texts.length === 0) return [];
      const res = await client.embeddings.create({
        model,
        input: texts,
        dimensions,
      });
      const byIndex = new Map<number, number[]>();
      for (const item of res.data) {
        if (item.embedding && item.index !== undefined) {
          byIndex.set(item.index, item.embedding as number[]);
        }
      }
      return texts.map((_, i) => {
        const vec = byIndex.get(i);
        if (!vec) throw new Error(`OpenAI embeddings missing vector for index ${i}`);
        return vec;
      });
    },
  };
}

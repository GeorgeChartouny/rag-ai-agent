/**
 * RAG agent: orchestrate retrieval + LLM generation.
 * Dependencies (retrievalRunner, llm) and optional minSourceScore are injected.
 */
import type { ILLM } from '../abstractions';
import type { RetrievalRunner } from '../chains/retrievalChain';
import { buildRagPrompt } from '../prompts/ragPrompt';
import { SYSTEM_PROMPT } from '../prompts/systemPrompt';

export interface RagAgentResponse {
  answer: string;
  sources?: Array<{ text: string; score?: number }>;
}

export interface RagAgentOptions {
  minSourceScore?: number;
}

function filterRelevantSources(
  chunks: Array<{ text: string; score?: number }>,
  minScore: number
): Array<{ text: string; score?: number }> {
  return chunks.filter(
    (c) => c.score != null && c.score >= minScore
  );
}

export function createRagAgent(
  retrievalRunner: RetrievalRunner,
  llm: ILLM,
  options?: RagAgentOptions
): (query: string, topK?: number) => Promise<RagAgentResponse> {
  const minSourceScore = options?.minSourceScore ?? 0.5;

  return async function invokeRagAgent(
    query: string,
    topK: number = 5
  ): Promise<RagAgentResponse> {
    const { chunks } = await retrievalRunner(query, topK);
    const context = chunks.map((c) => c.text).join('\n\n');
    const userContent = buildRagPrompt(context, query);
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      { role: 'user' as const, content: userContent },
    ];
    const answer = await llm.generate(messages);
    const sources = filterRelevantSources(
      chunks.map((c) => ({ text: c.text, score: c.score })),
      minSourceScore
    );
    return {
      answer,
      sources: sources.length > 0 ? sources : undefined,
    };
  };
}

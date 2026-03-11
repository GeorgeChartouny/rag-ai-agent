/**
 * RAG agent: orchestrate retrieval + LLM generation.
 * Dependencies (retrievalRunner, llm) are injected.
 */
import type { ILLM } from '../abstractions';
import type { RetrievalRunner } from '../chains/retrievalChain';
import { buildRagPrompt } from '../prompts/ragPrompt';
import { SYSTEM_PROMPT } from '../prompts/systemPrompt';

export interface RagAgentResponse {
  answer: string;
  sources?: Array<{ text: string; score?: number }>;
}

export function createRagAgent(
  retrievalRunner: RetrievalRunner,
  llm: ILLM
): (query: string, topK?: number) => Promise<RagAgentResponse> {
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
    return {
      answer,
      sources: chunks.map((c) => ({ text: c.text, score: c.score })),
    };
  };
}

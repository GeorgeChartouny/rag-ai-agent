/**
 * RAG agent: orchestrate retrieval + LLM generation.
 */

import { runRetrievalChain } from '../chains/retrievalChain';
import { buildRagPrompt } from '../prompts/ragPrompt';
import { SYSTEM_PROMPT } from '../prompts/systemPrompt';

export interface RagAgentResponse {
  answer: string;
  sources?: Array<{ text: string; score?: number }>;
}

export async function invokeRagAgent(query: string, topK: number = 5): Promise<RagAgentResponse> {
  const { chunks } = await runRetrievalChain(query, topK);
  const context = chunks.map((c) => c.text).join('\n\n');
  const prompt = buildRagPrompt(context, query);
  // TODO: call LLM (OpenAI) with SYSTEM_PROMPT + prompt, return answer
  const answer = '[LLM not wired yet]';
  return {
    answer,
    sources: chunks.map((c) => ({ text: c.text, score: c.score })),
  };
}

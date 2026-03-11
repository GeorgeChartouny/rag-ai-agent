/**
 * OpenAI chat LLM implementation. Implements ILLM using chat completions.
 */
import OpenAI from 'openai';
import type { ILLM, ChatMessage } from '../abstractions';

export interface OpenAILlmConfig {
  apiKey: string;
  model?: string;
}

export function createOpenAILlm(config: OpenAILlmConfig): ILLM {
  const client = new OpenAI({ apiKey: config.apiKey });
  const model = config.model ?? 'gpt-4o-mini';

  return {
    async generate(messages: ChatMessage[]): Promise<string> {
      const apiMessages = messages.map((m) => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content,
      }));
      const response = await client.chat.completions.create({
        model,
        messages: apiMessages,
      });
      const content = response.choices?.[0]?.message?.content;
      if (content == null) {
        throw new Error('OpenAI chat returned no content');
      }
      return content;
    },
  };
}

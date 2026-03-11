/**
 * Stub LLM for Phase 1. Implements ILLM with a fixed placeholder response.
 */
import type { ILLM, ChatMessage } from '../abstractions';

export function createStubLlm(): ILLM {
  return {
    async generate(_messages: ChatMessage[]): Promise<string> {
      return '[LLM not wired yet]';
    },
  };
}

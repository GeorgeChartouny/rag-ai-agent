/**
 * Stub LLM for Phase 1. Implements ILLM with a fixed placeholder response.
 */
import type { ILLM } from '../abstractions';

const STUB_RESPONSE = '[LLM not wired yet]';

export function createStubLlm(): ILLM {
  return {
    async generate(): Promise<string> {
      return STUB_RESPONSE;
    },
  };
}

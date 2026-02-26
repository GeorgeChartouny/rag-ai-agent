/**
 * LangSmith tracing / observability. Configure before running chains.
 */
import { env } from '../config/env';

export function initLangSmith(): void {
  if (env.langsmithTracing && env.langsmithApiKey) {
    process.env.LANGSMITH_TRACING = 'true';
    process.env.LANGSMITH_API_KEY = env.langsmithApiKey;
    if (env.langsmithProject) {
      process.env.LANGSMITH_PROJECT = env.langsmithProject;
    }
    // LangChain/LangSmith SDK will pick these up automatically
  }
}

/**
 * RAG prompt template: context + user question.
 */

export function buildRagPrompt(context: string, question: string): string {
  return `Use the following context to answer the question.

Context:
${context}

Question: ${question}

Answer:`;
}

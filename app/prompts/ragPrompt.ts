/**
 * RAG prompt template: context + user question.
 * When context is empty, instructs the model to answer from general knowledge.
 */

export function buildRagPrompt(context: string, question: string): string {
  const hasContext = context && context.trim().length > 0;
  if (!hasContext) {
    return `No retrieved context from the knowledge base. Answer the following question from your general knowledge if you can.

Question: ${question}

Answer:`;
  }
  return `Use the following context to answer the question when possible.

Context:
${context}

Question: ${question}

Answer:`;
}

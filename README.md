# RAG AI Agent

A **Node.js** Retrieval-Augmented Generation (RAG) AI agent using LangChain, OpenAI, and Pinecone.

## Pipeline

**Ingestion (indexing documents):**

```
User → Upload PDF
       ↓
Chunking → Embedding → Pinecone
```

**Query (chat):**

```
User Chat Query
       ↓
Retriever (Top-K)
       ↓
Orchestrator (LangChain)
       ↓
LLM (OpenAI)
       ↓
Response
```

## Structure

```
app/
  agents/        # RAG agent orchestration (ragAgent.ts)
  chains/        # Retrieval chain (retrievalChain.ts)
  embeddings/    # Embedder (embedder.ts)
  vectorstore/   # Pinecone client (pineconeClient.ts)
  ingestion/     # PDF processor (pdfProcessor.ts)
  prompts/       # systemPrompt.ts, ragPrompt.ts
  observability/ # LangSmith (langsmith.ts)
  routes/        # upload.ts, chat.ts
  config/        # env.ts
  main.ts        # Entry point

data/uploads/    # User-uploaded documents for RAG
```

## Setup

1. Install dependencies (from repo root):

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your API keys:

   ```bash
   cp .env.example .env
   ```

3. Run the application:

   ```bash
   npm start
   ```

   Or build then run: `npm run build` then `node dist/main.js`.

## Configuration

See `.env.example` for required environment variables (OpenAI API key, Pinecone, LangSmith, etc.).

## Development

- Run tests: `npm test`
- Agent and architecture notes: see `agents.md`

# RAG AI Agent

A Retrieval-Augmented Generation (RAG) AI agent application using LangChain, OpenAI, and Pinecone.

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
  agents/     # AI agent definitions and orchestration
  chains/     # Reusable LLM chains
  tools/      # Agent tools (search, calculators, etc.)
  embeddings/ # Embedding models and utilities
  vectorstore/ # Vector store and retrieval logic
  prompts/    # Prompt templates
  utils/      # Shared utilities

data/
  uploads/    # User-uploaded documents for RAG

tests/        # Unit and integration tests
```

## Setup

1. Create a virtual environment and install dependencies:

   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. Copy `.env.example` to `.env` and fill in your API keys and settings:

   ```bash
   cp .env.example .env
   ```

3. Run the application:

   ```bash
   python main.py
   ```

## Configuration

See `.env.example` for required environment variables (OpenAI API key, Pinecone, LangSmith, etc.).

## Development

- Run tests: `pytest tests/`
- Agent and architecture notes: see `agents.md`

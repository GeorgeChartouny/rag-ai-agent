# Agent Governance

## System Overview
This project implements a modular Retrieval-Augmented Generation (RAG) AI agent using:
- OpenAI (LLM)
- LangChain (Orchestration)
- Pinecone (Vector Storage)
- LangSmith (Observability)

## Architecture Rules
- Retrieval logic must be isolated from generation logic.
- No direct LLM calls outside agent layer.
- Prompts must live in /prompts directory.
- Vector operations must go through vectorstore abstraction.

## Agent Behavior
- Always attempt retrieval first.
- If similarity score < threshold, fallback to direct LLM.
- Cite document context when used.
- Avoid hallucination when context exists.

## Coding Standards
- Use TypeScript strictly.
- No hardcoded secrets.
- Follow dependency injection pattern.
- Modular design only.

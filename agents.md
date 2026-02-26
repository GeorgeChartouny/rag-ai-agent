# Agents Governance

## System Role
This project implements a modular RAG-based AI agent using LangChain, Pinecone, and OpenAI. The architecture follows separation of concerns between retrieval, generation, and orchestration.

## Architectural Rules
- Retrieval must be isolated from generation logic.
- Vector operations must be abstracted via vectorstore layer.
- No business logic inside prompt templates.
- All prompts must be versioned inside /prompts directory.

## Agent Behavior Constraints
- Always prefer retrieved context over model memory.
- If retrieval confidence is low, fallback to direct LLM.
- Responses must cite document chunks when applicable.

## Coding Constraints
- Follow clean architecture.
- Use dependency injection for LLM and vectorstore.
- Avoid hardcoded API keys.
import { LangChainTracer } from "langchain/callbacks";

export const tracer = new LangChainTracer({
  projectName: process.env.LANGCHAIN_PROJECT,
});
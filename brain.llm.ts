import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llmBrain = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash",
  apiKey: Bun.env.GOOGLE_API_KEY,
  // Lower temperature is recommended for RAG systems
  // because it reduces hallucinations and keeps answers
  // grounded in the retrieved context.
  temperature: 0.3,
});
export { llmBrain };

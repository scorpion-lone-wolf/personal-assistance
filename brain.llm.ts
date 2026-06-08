import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llmBrain = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash",
  apiKey: Bun.env.GOOGLE_API_KEY,
  temperature: 1.0,
});
export { llmBrain };

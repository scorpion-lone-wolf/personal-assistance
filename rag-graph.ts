import { END, START, StateGraph, StateSchema, type GraphNode } from "@langchain/langgraph";
import readline from "node:readline/promises";
import * as z from "zod";
import { llmBrain } from "./brain.llm";
import { initailizeVectorStoreAndEmbedding } from "./vector";

// State that is shared between all the node
const State = new StateSchema({
  query: z.string(),
  context: z.string(),
  answer: z.string(),
});

// retrieval node
// This node is responsible to geeting the context from pgvector db
const retrievalNode: GraphNode<typeof State> = async state => {
  const vectorStore = await initailizeVectorStoreAndEmbedding();
  const docs = await vectorStore.similaritySearch(state.query, 3);

  const context = docs
    .map(doc => {
      return doc.pageContent;
    })
    .join("\n\n");
  return { context: context };
};

const generateNode: GraphNode<typeof State> = async state => {
  const prompt = `
    You are a helpful AI assistant.

    Answer the user's question using the provided context.

    Do not say things like:
    - "According to the document"
    - "Based on the provided context"
    - "The file states"

    Instead, answer naturally as if the information is part of your knowledge.
    Think To remember:
    - If you think the question and context doesn't match then say "I don't know" and you can add more to create proper sentence in polite way.
    - Dont let user know what memory, context or content we are using.
    - make you you wrap up in 4 to 5 sentences.
    <Context>
    ${state.context}
    </Context>

    <Question>
    ${state.query}
    </Question>
`;
  const response = await llmBrain.invoke(prompt);
  return {
    answer: response.content as string,
  };
};

// Graph flow
const graph = new StateGraph(State)
  .addNode("retrieval", retrievalNode)
  .addNode("generate", generateNode)
  .addEdge(START, "retrieval")
  .addEdge("retrieval", "generate")
  .addEdge("generate", END)
  .compile();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
while (true) {
  const input = await rl.question("User:");
  if (input == "bye") {
    break;
  }
  const answer = await graph.invoke({
    query: input,
  });
  console.log("AI:", answer.answer);
}
rl.close();
process.exit(0);

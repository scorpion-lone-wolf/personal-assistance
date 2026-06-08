import { llmBrain } from "./brain.llm";
import { initailizeVectorStoreAndEmbedding } from "./vector";

const query = "What is proto buffer?";

// -----------------------------------------------------------------------------
// Step 1: Initialize the vector store.
// The vector store already knows which embedding model was used during indexing.
// -----------------------------------------------------------------------------
const vectorStore = await initailizeVectorStoreAndEmbedding();

// -----------------------------------------------------------------------------
// Step 2: Retrieve the most relevant chunks from pgvector.
//
// Internally, LangChain:
//   1. Converts the query into an embedding vector.
//   2. Performs a similarity search in pgvector.
//   3. Returns the top matching document chunks.
//
// So we don't need to manually generate the query embedding.
// -----------------------------------------------------------------------------
const retrievedDocuments = await vectorStore.similaritySearch(query, 5);

// -----------------------------------------------------------------------------
// Step 3: Combine the retrieved chunks into a single context string.
// This context will be passed to the LLM along with the user's question.
// -----------------------------------------------------------------------------
const context = retrievedDocuments.map(doc => doc.pageContent).join("\n\n");

// -----------------------------------------------------------------------------
// Step 4: Create the RAG prompt.
//
// The model should answer using the retrieved context, but the response should
// sound natural and not explicitly mention that the information came from a file
// or document unless the context itself requires it.
// -----------------------------------------------------------------------------
const prompt = `
You are a helpful AI assistant.

Answer the user's question using the provided context.

Do not say things like:
- "According to the document"
- "Based on the provided context"
- "The file states"

Instead, answer naturally as if the information is part of your knowledge.

Context:
${context}

Question:
${query}

Answer:
`;

// -----------------------------------------------------------------------------
// Step 5: Send the prompt to the LLM.
// -----------------------------------------------------------------------------
const response = await llmBrain.invoke(prompt);

// -----------------------------------------------------------------------------
// Step 6: Output the final answer.
// -----------------------------------------------------------------------------
console.log(response.content);

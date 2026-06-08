import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PGVectorStore, type DistanceStrategy } from "@langchain/pgvector";

export async function initailizeVectorStoreAndEmbedding() {
  // Embeddings convert text chunks into vectors that can be stored and searched.
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: Bun.env.GOOGLE_API_KEY,
    model: "gemini-embedding-001",
  });

  const vectorStoreConfig = {
    // Local Postgres/pgvector settings that match compose.yml.
    postgresConnectionOptions: {
      type: "postgres",
      host: "localhost",
      port: 5432,
      user: "postgres",
      password: "mysecretpassword",
      database: "my_vec_db",
    },

    // Column names used by LangChain inside the pgvector table.
    columns: {
      idColumnName: "id",
      vectorColumnName: "vector",
      contentColumnName: "content",
      metadataColumnName: "metadata",
    },
    tableName: "testlangchainjs",
    distanceStrategy: "cosine" as DistanceStrategy,
  };
  // Initialize the vector store once, then reuse it from other files.
  const vectorStore = await PGVectorStore.initialize(embeddings, vectorStoreConfig);
  return vectorStore;
}

# Learning Notes: Indexing Knowledge Base Data

The goal is to store your knowledge base notes inside a vector database so the app can search by meaning later, not only by exact words.

"Indexing – The process of chunking documents, generating embeddings for them, and storing those embeddings in a vector database."

## Files Involved

- `knowledge-base/`: Stores the Markdown notes that will be indexed.
- `indexing.ts`: Loads, splits, clears old records, and saves fresh embeddings.
- `vector.ts`: Connects the embedding model with the pgvector database.
- `compose.yml`: Starts the local Postgres database with pgvector support.

## Steps And Reasons

1. Load the knowledge base files.

   `DirectoryLoader` reads files from the `knowledge-base` folder. `TextLoader` is used for `.md` files because Markdown is plain text.

   Reason: before saving anything into a vector database, the code first needs to collect the source text.

2. Split the loaded documents into chunks.

   `RecursiveCharacterTextSplitter` breaks large files into smaller pieces.
   - `chunkSize`: the maximum size of one chunk.
   - `chunkOverlap`: the amount of repeated text between nearby chunks.

   Reason: embedding models work better with smaller focused text. Overlap helps keep context when an important idea is split between two chunks.

3. Create embeddings for each chunk.

   The embedding model converts text into numeric vectors.

   Reason: vectors allow the database to compare meaning. Similar ideas should have vectors that are close to each other.

4. Clear old embeddings for the same source file.

   The code checks each chunk's `metadata.source`, then deletes old rows for that source before inserting the new ones.

   Reason: if the indexing script runs again, the database should not keep duplicate chunks for the same file.

5. Save the new chunks into pgvector.

   `vectorStore.addDocuments(...)` stores the chunk text, metadata, and embedding vectors in the configured table.

   Reason: once the data is stored, the app can later search the knowledge base using vector similarity.

## Current Flow

1. Start the vector database from `compose.yml`.
2. Run the indexing script.
3. The script loads Markdown files from `knowledge-base`.
4. The script splits the files into chunks.
5. The script removes old database rows for the same source files.
6. The script inserts the fresh chunk embeddings into pgvector.

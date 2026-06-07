import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/classic/text_splitter";

import type { Document } from "langchain";
import { vectorStore } from "./vector";

const KNOWLEDGE_BASE_PATH = "./knowledge-base";

// Load every Markdown file from the knowledge base folder.
const loader = new DirectoryLoader(KNOWLEDGE_BASE_PATH, {
  ".md": (path) => new TextLoader(path),
});
const documents = await loader.load();

// Break large files into smaller chunks before creating embeddings.
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1500,
  chunkOverlap: 150,
});
const chunkedDocuments: Document[] = await splitter.splitDocuments(documents);

// Each chunk keeps metadata.source, so old rows for the same file can be cleared first.
const uniqueSources = [
  ...new Set(chunkedDocuments.map((document) => document.metadata.source)),
];

for (const sourcePath of uniqueSources) {
  console.log(`Clearing old database embeddings for file: ${sourcePath}`);

  // Prevent duplicate embeddings when the same file is indexed again.
  await vectorStore.delete({
    filter: {
      source: sourcePath,
    },
  });
}

await vectorStore.addDocuments(chunkedDocuments);

console.log("Indexing run successfully");

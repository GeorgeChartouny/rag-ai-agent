/**
 * Upload route: accept PDF, process, embed, and index into Pinecone.
 * Dependencies (embedder, vectorStore, indexName) are injected.
 */
import { Router, Request, Response } from 'express';
import multer from 'multer';
import { processPdf } from '../ingestion/pdfProcessor';
import type { IEmbedder, IVectorStore } from '../abstractions';

export interface UploadRouteDeps {
  embedder: IEmbedder;
  vectorStore: IVectorStore;
  indexName: string;
}

const upload = multer({ storage: multer.memoryStorage() });

export function createUploadRouter(deps: UploadRouteDeps): Router {
  const router = Router();

  router.post('/', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file;
      if (!file || file.mimetype !== 'application/pdf') {
        res.status(400).json({ error: 'Please upload a PDF file' });
        return;
      }
      const chunks = await processPdf(file.buffer, file.originalname);
      if (chunks.length === 0) {
        res.status(200).json({ message: 'No text extracted from PDF' });
        return;
      }
      const vectors = await deps.embedder.embedDocuments(chunks.map((c) => c.text));
      // TODO Phase 3: generate IDs (e.g. uuid), build payload, call vectorStore.upsert
      await deps.vectorStore.upsert(deps.indexName, []);
      res.status(200).json({ message: 'PDF processed', chunks: chunks.length });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return router;
}

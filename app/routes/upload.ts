/**
 * Upload route: accept PDF, process, embed, and index into Pinecone.
 */
import { Router, Request, Response } from 'express';
import multer from 'multer';
import { processPdf } from '../ingestion/pdfProcessor';
import { embedDocuments } from '../embeddings/embedder';
import { upsertVectors } from '../vectorstore/pineconeClient';
import { env } from '../config/env';

const upload = multer({ storage: multer.memoryStorage() });
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
    const vectors = await embedDocuments(chunks.map((c) => c.text));
    // TODO: generate IDs (e.g. uuid), then upsertVectors(env.pineconeIndex, ...)
    await upsertVectors(env.pineconeIndex, []);
    res.status(200).json({ message: 'PDF processed', chunks: chunks.length });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;

/**
 * Chat route: accept user message, run RAG agent, return response.
 */
import { Router, Request, Response } from 'express';
import { invokeRagAgent } from '../agents/ragAgent';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, topK } = req.body as { message?: string; topK?: number };
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Missing or invalid "message" in body' });
      return;
    }
    const result = await invokeRagAgent(message.trim(), topK ?? 5);
    res.status(200).json({ answer: result.answer, sources: result.sources });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;

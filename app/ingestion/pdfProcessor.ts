/**
 * PDF ingestion: parse PDFs and produce text chunks for embedding and indexing.
 */
import { PDFParse } from 'pdf-parse';

export interface PdfChunk {
  text: string;
  metadata?: { page?: number; source?: string };
}

const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_OVERLAP = 200;

export async function processPdf(
  buffer: Buffer,
  filename?: string
): Promise<PdfChunk[]> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    const text =
      typeof result === 'string'
        ? result
        : (result as { text?: string })?.text ?? '';
    await parser.destroy?.();
    if (!text || !text.trim()) return [];

    const source = filename ?? 'unknown';
    const chunkStrings = chunkText(text, {
      chunkSize: DEFAULT_CHUNK_SIZE,
      overlap: DEFAULT_OVERLAP,
    });

    return chunkStrings.map((t) => ({
      text: t,
      metadata: { source },
    }));
  } catch {
    await parser.destroy?.().catch(() => {});
    return [];
  }
}

export function chunkText(
  text: string,
  options?: { chunkSize?: number; overlap?: number }
): string[] {
  const chunkSize = options?.chunkSize ?? 1000;
  const overlap = options?.overlap ?? 200;
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

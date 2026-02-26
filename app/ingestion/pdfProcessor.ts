/**
 * PDF ingestion: parse PDFs and produce text chunks for embedding and indexing.
 */

export interface PdfChunk {
  text: string;
  metadata?: { page?: number; source?: string };
}

export async function processPdf(buffer: Buffer, _filename?: string): Promise<PdfChunk[]> {
  // TODO: use pdf-parse (or similar) to extract text, then chunk with overlap
  return [];
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

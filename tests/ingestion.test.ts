/**
 * Phase 3: Ingestion test. processPdf extracts text and produces chunks;
 * optional: upload flow and retrieval returns chunk from PDF.
 */
import 'dotenv/config';
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { processPdf } from '../app/ingestion/pdfProcessor';
import { runRetrievalChain } from '../app/chains/retrievalChain';
import { compose } from '../app/composition';

const FIXTURE_PATH = join(__dirname, 'fixtures', 'sample.pdf');

describe('ingestion (Phase 3)', () => {
  it('processPdf returns chunks with text and source metadata', async () => {
    let buffer: Buffer;
    try {
      buffer = await readFile(FIXTURE_PATH);
    } catch {
      return; // skip if no fixture (add tests/fixtures/sample.pdf to run)
    }
    const chunks = await processPdf(buffer, 'sample.pdf');
    assert.ok(Array.isArray(chunks), 'should return array');
    if (chunks.length === 0) return;
    assert.ok(chunks[0].text.length > 0, 'first chunk should have text');
    assert.strictEqual(
      chunks[0].metadata?.source,
      'sample.pdf',
      'metadata.source should be filename'
    );
  });

  it(
    'upload flow: retrieval returns chunk containing phrase from PDF',
    { skip: !process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX },
    async () => {
      let buffer: Buffer;
      try {
        buffer = await readFile(FIXTURE_PATH);
      } catch {
        return;
      }
      const chunks = await processPdf(buffer, 'sample.pdf');
      if (chunks.length === 0) return;

      const deps = compose();
      const vectors = await deps.embedder.embedDocuments(chunks.map((c) => c.text));
      const records = chunks.map((chunk, i) => ({
        id: uuidv4(),
        values: vectors[i],
        metadata: {
          text: chunk.text,
          source: chunk.metadata?.source ?? 'sample.pdf',
        },
      }));
      await deps.vectorStore.upsert(deps.indexName, records);

      const phrase = chunks[0].text.slice(0, 30).trim();
      if (!phrase) return;
      const { chunks: hits } = await runRetrievalChain(
        deps.embedder,
        deps.vectorStore,
        deps.indexName,
        phrase,
        5
      );
      assert.ok(hits.length > 0, 'retrieval should return at least one chunk');
      const found = hits.some((h) => h.text.includes(phrase) || phrase.includes(h.text.slice(0, 30)));
      assert.ok(found, 'at least one hit should contain the phrase from the PDF');
    }
  );
});

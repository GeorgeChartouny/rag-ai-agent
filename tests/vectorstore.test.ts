/**
 * Phase 2: Vector store test. Upsert vectors then query; assert IDs, scores, metadata.
 * Requires OPENAI_API_KEY, PINECONE_API_KEY, PINECONE_INDEX in env.
 */
import 'dotenv/config';
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { compose } from '../app/composition';
import { env } from '../app/config/env';

const hasPinecone =
  Boolean(env.pineconeApiKey && env.pineconeIndex);

describe('vector store (Phase 2)', () => {
  const deps = compose();

  it(
    'upsert then query returns matching IDs and metadata',
    { skip: !hasPinecone },
    async () => {
      const texts = ['first chunk', 'second chunk', 'third chunk'];
      const vectors = await deps.embedder.embedDocuments(texts);
      assert.strictEqual(vectors.length, 3);

      const ids = ['phase2-id-1', 'phase2-id-2', 'phase2-id-3'];
      const records = ids.map((id, i) => ({
        id,
        values: vectors[i],
        metadata: { text: texts[i], index: i },
      }));

      await deps.vectorStore.upsert(deps.indexName, records);

      const queryVector = await deps.embedder.embedText('first chunk');
      const hits = await deps.vectorStore.query(
        deps.indexName,
        queryVector,
        3
      );

      assert.ok(hits.length > 0, 'query should return at least one hit');
      const idsFound = hits.map((h) => h.id);
      assert.ok(
        idsFound.includes('phase2-id-1'),
        'should find phase2-id-1 (most similar to "first chunk")'
      );
      const withMeta = hits.find((h) => h.metadata?.text === 'first chunk');
      assert.ok(withMeta, 'hit should have metadata.text');
      if (withMeta?.score !== undefined) {
        assert.ok(
          typeof withMeta.score === 'number',
          'score should be a number'
        );
      }
    }
  );
});

/**
 * Phase 1: Unit test for injectable embedder.
 * Uses composition root to get real OpenAI embedder; requires OPENAI_API_KEY in env.
 */
import 'dotenv/config';
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { compose } from '../app/composition';
import { env } from '../app/config/env';

describe('embedder (Phase 1)', () => {
  const deps = compose();
  const expectedDim = env.openaiEmbeddingDimensions;

  it('embedText returns a non-empty vector of expected dimensions', async () => {
    const vector = await deps.embedder.embedText('hello');
    assert.ok(Array.isArray(vector), 'result should be an array');
    assert.ok(vector.length > 0, 'result should be non-empty');
    assert.strictEqual(
      vector.length,
      expectedDim,
      `result length should be ${expectedDim} (openaiEmbeddingDimensions)`
    );
    assert.ok(
      vector.every((x) => typeof x === 'number'),
      'every element should be a number'
    );
  });

  it('embedDocuments returns one vector per input of expected dimensions', async () => {
    const vectors = await deps.embedder.embedDocuments(['a', 'b']);
    assert.strictEqual(vectors.length, 2, 'should return 2 vectors');
    for (let i = 0; i < vectors.length; i++) {
      assert.ok(Array.isArray(vectors[i]), `vector ${i} should be array`);
      assert.strictEqual(
        vectors[i].length,
        expectedDim,
        `vector ${i} length should be ${expectedDim}`
      );
    }
  });
});

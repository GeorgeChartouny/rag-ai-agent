"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Phase 1: Unit test for injectable embedder.
 * Uses composition root to get real OpenAI embedder; requires OPENAI_API_KEY in env.
 */
require("dotenv/config");
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const composition_1 = require("../app/composition");
const env_1 = require("../app/config/env");
(0, node_test_1.describe)('embedder (Phase 1)', () => {
    const deps = (0, composition_1.compose)();
    const expectedDim = env_1.env.openaiEmbeddingDimensions;
    (0, node_test_1.it)('embedText returns a non-empty vector of expected dimensions', async () => {
        const vector = await deps.embedder.embedText('hello');
        node_assert_1.default.ok(Array.isArray(vector), 'result should be an array');
        node_assert_1.default.ok(vector.length > 0, 'result should be non-empty');
        node_assert_1.default.strictEqual(vector.length, expectedDim, `result length should be ${expectedDim} (openaiEmbeddingDimensions)`);
        node_assert_1.default.ok(vector.every((x) => typeof x === 'number'), 'every element should be a number');
    });
    (0, node_test_1.it)('embedDocuments returns one vector per input of expected dimensions', async () => {
        const vectors = await deps.embedder.embedDocuments(['a', 'b']);
        node_assert_1.default.strictEqual(vectors.length, 2, 'should return 2 vectors');
        for (let i = 0; i < vectors.length; i++) {
            node_assert_1.default.ok(Array.isArray(vectors[i]), `vector ${i} should be array`);
            node_assert_1.default.strictEqual(vectors[i].length, expectedDim, `vector ${i} length should be ${expectedDim}`);
        }
    });
});

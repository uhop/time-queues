import test from 'tape-six';

import batch from '../src/batch.js';

test('TS: batch() accepts mixed input types', async t => {
  const result: unknown[] = await batch(
    [() => Promise.resolve(1), Promise.resolve(2), 'literal', 42],
    2
  );
  t.equal(result.length, 4);
});

test('TS: batch() return type is Promise<unknown[]>', async t => {
  const p: Promise<unknown[]> = batch([]);
  const result = await p;
  t.deepEqual(result, []);
});

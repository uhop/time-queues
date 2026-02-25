import test from 'tape-six';

import batch from '../src/batch.js';
import randomSleep from '../src/random-sleep.js';

test('batch', async t => {
  t.equal(typeof batch, 'function');

  let counter = 0,
    maxCount = 0;

  const f = async () => {
    ++counter;
    maxCount = Math.max(maxCount, counter);
    await randomSleep(10, 5);
    --counter;
  };

  const fs = [],
    N = 20,
    M = 3;

  for (let i = 0; i < N; ++i) {
    fs.push(f);
  }

  await batch(fs, M);

  t.equal(maxCount, M);
});

test('batch: empty array', async t => {
  const result = await batch([]);
  t.deepEqual(result, []);
});

test('batch: error propagation', async t => {
  const error = new Error('fail');
  try {
    await batch(
      [() => Promise.resolve(1), () => Promise.reject(error), () => Promise.resolve(3)],
      3
    );
    t.fail('should have thrown');
  } catch (e) {
    t.equal(e, error);
  }
});

test('batch: mixed values', async t => {
  const result = await batch([() => 1, Promise.resolve(2), 3], 2);
  t.deepEqual(result, [1, 2, 3]);
});

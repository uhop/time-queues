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

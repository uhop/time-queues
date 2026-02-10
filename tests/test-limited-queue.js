import test from 'tape-six';

import {LimitedQueue} from '../src/LimitedQueue.js';
import randomSleep from '../src/random-sleep.js';

test('LimitedQueue', async t => {
  t.equal(typeof LimitedQueue, 'function');

  let counter = 0,
    maxCount = 0;

  const fn = i => async () => {
    ++counter;
    maxCount = Math.max(maxCount, counter);
    await randomSleep(10, 5);
    --counter;
    return i;
  };

  const fs = [],
    N = 20,
    M = 3;

  const queue = new LimitedQueue(M);

  for (let i = 0; i < N; ++i) {
    const task = queue.schedule(fn(i));
    fs.push(task.promise);
  }

  await Promise.all(fs);

  t.equal(counter, 0);
  t.equal(maxCount, M);
});

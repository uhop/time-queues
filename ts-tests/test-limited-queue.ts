import test from 'tape-six';

import {LimitedQueue} from '../src/LimitedQueue.js';
import randomSleep from '../src/random-sleep.js';

test('LimitedQueue with random sleep', async t => {
  t.equal(typeof LimitedQueue, 'function');

  let counter = 0,
    maxCount = 0;

  const fn = (i: number) => async () => {
    ++counter;
    maxCount = Math.max(maxCount, counter);
    await randomSleep(10, 5);
    --counter;
    return i;
  };

  const fs: Promise<number>[] = [],
    N = 20,
    M = 3;

  const queue = new LimitedQueue(M);
  t.ok(queue.isIdle);

  for (let i = 0; i < N; ++i) {
    const task = queue.schedule(fn(i));
    fs.push(task.promise);
  }

  await Promise.all(fs);

  await queue.waitForIdle();
  t.ok(queue.isIdle);

  t.equal(counter, 0);
  t.equal(maxCount, M);
});

test('LimitedQueue with sync tasks', async t => {
  let counter = 0,
    maxCount = 0;

  const fn = (i: number) => () => {
    ++counter;
    maxCount = Math.max(maxCount, counter);
    --counter;
    return i;
  };

  const fs: Promise<number>[] = [],
    N = 20,
    M = 3;

  const queue = new LimitedQueue(M);

  for (let i = 0; i < N; ++i) {
    const task = queue.schedule(fn(i));
    fs.push(task.promise);
  }

  await Promise.all(fs);

  t.equal(counter, 0);
  t.ok(maxCount <= M);
});

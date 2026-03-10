import test from 'tape-six';

import {LimitedQueue} from '../src/LimitedQueue.js';
import randomSleep from '../src/random-sleep.js';
import sleep from '../src/sleep.js';

test('LimitedQueue with random sleep', async t => {
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

  const fn = i => () => {
    ++counter;
    maxCount = Math.max(maxCount, counter);
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
  t.ok(maxCount <= M);
});

test('LimitedQueue: taskLimit getter/setter', t => {
  const queue = new LimitedQueue(3);
  t.equal(queue.taskLimit, 3);

  queue.taskLimit = 5;
  t.equal(queue.taskLimit, 5);

  queue.taskLimit = 0;
  t.equal(queue.taskLimit, 1);
});

test('LimitedQueue: activeTasks and isIdle', async t => {
  const queue = new LimitedQueue(2);
  t.equal(queue.activeTasks, 0);
  t.ok(queue.isIdle);

  queue.schedule(async () => await sleep(30));
  await sleep(5);
  t.equal(queue.activeTasks, 1);
  t.notOk(queue.isIdle);

  await queue.waitForIdle();
  t.ok(queue.isIdle);
  t.equal(queue.activeTasks, 0);
});

test('LimitedQueue: pause/resume', async t => {
  const queue = new LimitedQueue(2, true);
  t.ok(queue.paused);

  const results = [];
  queue.schedule(() => results.push('a'));
  queue.schedule(() => results.push('b'));

  await sleep(20);
  t.deepEqual(results, []);

  queue.resume();
  await queue.waitForIdle();
  t.deepEqual(results, ['a', 'b']);
});

test('LimitedQueue: clear cancels pending tasks', async t => {
  const queue = new LimitedQueue(1);
  const results = [];

  queue.schedule(async () => {
    await sleep(30);
    results.push('a');
  });
  const task2 = queue.schedule(() => results.push('b'));
  task2.promise.catch(() => {});

  await sleep(5);
  queue.clear();
  t.ok(task2.isCanceled);

  await sleep(40);
  t.deepEqual(results, ['a']);
});

test('LimitedQueue: waitForIdle resolves immediately if idle', async t => {
  const queue = new LimitedQueue(2);
  await queue.waitForIdle();
  t.ok(queue.isIdle);
});

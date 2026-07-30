import test from 'tape-six';
import fc from 'fast-check';
import 'tape-six-fast-check';

import LimitedQueue from 'time-queues/LimitedQueue.js';

test('LimitedQueue: cap never exceeded, drains to completion', async t => {
  await t.prop(
    [fc.scheduler(), fc.integer({min: 1, max: 4}), fc.integer({min: 0, max: 12})],
    async (s, limit, n) => {
      const queue = new LimitedQueue(limit);
      let high = 0,
        completed = 0;
      for (let i = 0; i < n; ++i) {
        queue.enqueue(() => {
          high = Math.max(high, queue.activeTasks);
          return s.schedule(Promise.resolve(), `task ${i}`).then(() => ++completed);
        });
      }
      await s.waitFor(queue.waitForIdle());
      return high <= limit && completed === n && queue.isIdle;
    },
    'activeTasks never exceeds the limit and every task completes'
  );
});

test('LimitedQueue: tasks start in enqueue order under any interleaving', async t => {
  await t.prop(
    [fc.scheduler(), fc.integer({min: 1, max: 3}), fc.integer({min: 1, max: 10})],
    async (s, limit, n) => {
      const queue = new LimitedQueue(limit);
      const starts = [];
      for (let i = 0; i < n; ++i) {
        queue.enqueue(() => {
          starts.push(i);
          return s.schedule(Promise.resolve(), `task ${i}`);
        });
      }
      await s.waitFor(queue.waitForIdle());
      return starts.length === n && starts.every((started, index) => started === index);
    },
    'start order is FIFO regardless of completion order'
  );
});

test('LimitedQueue: waitForIdle resolves only when truly idle', async t => {
  await t.scheduler(async s => {
    const queue = new LimitedQueue(2);
    let completed = 0;
    for (let i = 0; i < 5; ++i) {
      queue.enqueue(() => s.schedule(Promise.resolve(), `task ${i}`).then(() => ++completed));
    }
    const atIdle = queue.waitForIdle().then(() => queue.isIdle && completed === 5);
    return s.waitFor(atIdle);
  }, 'idle waiters observe a drained queue');
});

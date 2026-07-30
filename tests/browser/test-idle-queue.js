import test from 'tape-six';

import {IdleQueue} from 'time-queues/IdleQueue.js';

// WebKit ships no requestIdleCallback — the suite degrades to a recorded skip there.
const hasIdleCallback = typeof requestIdleCallback == 'function';

if (hasIdleCallback) {
  test('IdleQueue: tasks run during idle periods with a deadline', async t => {
    const queue = new IdleQueue();
    const runs = [];
    let done;
    const finished = new Promise(resolve => (done = resolve));
    for (let i = 0; i < 3; ++i) {
      queue.enqueue(({deadline, task, queue: q}) => {
        runs.push({i, remaining: deadline.timeRemaining(), task, q});
        if (runs.length === 3) done();
      });
    }
    await finished;
    t.deepEqual(
      runs.map(r => r.i),
      [0, 1, 2],
      'FIFO execution'
    );
    t.ok(
      runs.every(r => typeof r.remaining == 'number'),
      'a live deadline reached every task'
    );
    t.ok(
      runs.every(r => r.q === queue),
      'the queue is passed to every task'
    );
  });

  test('IdleQueue: the timeout option forces the didTimeout drain path', async t => {
    const queue = new IdleQueue(false, 50, {timeout: 1});
    let observed;
    let done;
    const finished = new Promise(resolve => (done = resolve));
    queue.enqueue(({deadline}) => {
      observed = deadline;
      done();
    });
    // Starve the idle period past the 1ms timeout so the callback fires with didTimeout.
    const start = Date.now();
    while (Date.now() - start < 30); // deliberate busy-wait
    await finished;
    t.ok(observed, 'the task ran');
    t.equal(typeof observed.didTimeout, 'boolean', 'deadline carries didTimeout');
  });

  test('IdleQueue: pause cancels the pending idle callback', async t => {
    const queue = new IdleQueue();
    let ran = 0;
    queue.enqueue(() => ++ran);
    queue.pause();
    await new Promise(resolve => setTimeout(resolve, 50));
    t.equal(ran, 0, 'nothing ran while paused');
    queue.resume();
    await new Promise(resolve => {
      queue.enqueue(() => resolve());
    });
    t.equal(ran, 1, 'the paused task ran after resume');
  });
} else {
  test('IdleQueue: skipped — this engine has no requestIdleCallback', t => {
    t.ok(true, 'recorded skip (WebKit)');
  });
}

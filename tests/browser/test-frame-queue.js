import test from 'tape-six';

import {FrameQueue} from 'time-queues/FrameQueue.js';

const nextFrames = (n = 2) =>
  new Promise(resolve => {
    const step = () => (--n > 0 ? requestAnimationFrame(step) : resolve());
    requestAnimationFrame(step);
  });

test('FrameQueue: tasks run inside an animation frame in order', async t => {
  const queue = new FrameQueue();
  const runs = [];
  let done;
  const finished = new Promise(resolve => (done = resolve));
  for (let i = 0; i < 3; ++i) {
    queue.enqueue(({timeStamp}) => {
      runs.push({i, timeStamp});
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
    runs.every(r => typeof r.timeStamp == 'number'),
    'rAF timestamp passed to every task'
  );
  t.equal(new Set(runs.map(r => r.timeStamp)).size, 1, 'all three ran in the same frame');
});

test('FrameQueue: tasks enqueued while draining run on the next frame', async t => {
  const queue = new FrameQueue();
  const stamps = [];
  let done;
  const finished = new Promise(resolve => (done = resolve));
  queue.enqueue(({timeStamp}) => {
    stamps.push(timeStamp);
    queue.enqueue(({timeStamp: nested}) => {
      stamps.push(nested);
      done();
    });
  });
  await finished;
  t.equal(stamps.length, 2, 'both tasks ran');
  t.notEqual(stamps[0], stamps[1], 'the nested task ran in a later frame');
});

test('FrameQueue: pause cancels the pending frame, resume re-arms it', async t => {
  const queue = new FrameQueue();
  let ran = 0;
  queue.enqueue(() => ++ran);
  queue.pause();
  await nextFrames(3);
  t.equal(ran, 0, 'nothing ran while paused');
  t.notOk(queue.isEmpty, 'the task is still queued');
  queue.resume();
  await nextFrames(3);
  t.equal(ran, 1, 'the task ran after resume');
});

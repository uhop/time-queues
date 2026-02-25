import test from 'tape-six';

import ListQueue from '../src/ListQueue.js';

test('ListQueue', t => {
  t.equal(typeof ListQueue, 'function');

  const queue = new ListQueue();

  t.ok(queue.isEmpty);
  t.notOk(queue.paused);

  queue.pause();
  t.ok(queue.paused);
  queue.resume();
  t.notOk(queue.paused);

  const fn = () => {},
    fn1 = () => 1,
    fn2 = () => 2;

  const task = queue.enqueue(fn);
  t.notOk(queue.isEmpty);
  t.equal(task.fn, fn);

  queue.clear();
  t.ok(queue.isEmpty);

  const task1 = queue.enqueue(fn1);
  const task2 = queue.enqueue(fn2);
  t.equal(task1.fn, fn1);
  t.equal(task2.fn, fn2);

  queue.dequeue(task2);
  t.notOk(queue.isEmpty);
  queue.dequeue(task1);
  t.ok(queue.isEmpty);
});

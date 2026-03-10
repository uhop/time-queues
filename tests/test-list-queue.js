import test from 'tape-six';

import ListQueue from '../src/ListQueue.js';
import CancelTaskError from '../src/CancelTaskError.js';

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

test('ListQueue: schedule() creates promise', async t => {
  const queue = new ListQueue();
  const task = queue.schedule(() => 42);

  t.ok(task.promise instanceof Promise);
});

test('ListQueue: schedule(null) creates promise', async t => {
  const queue = new ListQueue();
  const task = queue.schedule(null);

  t.ok(task.promise instanceof Promise);
});

test('ListQueue: dequeue cancels task', t => {
  const queue = new ListQueue();
  const task = queue.enqueue(() => {});

  queue.dequeue(task);
  t.ok(task.isCanceled);
  t.ok(queue.isEmpty);
});

test('ListQueue: clear cancels all tasks', t => {
  const queue = new ListQueue();
  const task1 = queue.enqueue(() => {});
  const task2 = queue.enqueue(() => {});

  queue.clear();
  t.ok(task1.isCanceled);
  t.ok(task2.isCanceled);
  t.ok(queue.isEmpty);
});

test('ListQueue: clear rejects promises with CancelTaskError', async t => {
  const queue = new ListQueue();
  const task = queue.schedule(() => 99);

  queue.clear();
  try {
    await task.promise;
    t.fail('should have thrown');
  } catch (e) {
    t.ok(e instanceof CancelTaskError);
  }
});

test('ListQueue: pause/resume chaining', t => {
  const queue = new ListQueue();
  const result = queue.pause();
  t.equal(result, queue);
  const result2 = queue.resume();
  t.equal(result2, queue);
});

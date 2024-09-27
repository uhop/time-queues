'use strict';

import test from 'tape-six';

import ListQueue from '../src/ListQueue.js';

test('ListQueue', t => {
  t.equal(typeof ListQueue, 'function');

  const queue = new ListQueue();

  t.equal(queue.isEmpty, true);
  t.equal(queue.paused, false);

  queue.pause();
  t.equal(queue.paused, true);
  queue.resume();
  t.equal(queue.paused, false);

  const fn = () => {}, fn1 = () => 1, fn2 = () => 2;

  const task = queue.enqueue(fn);
  t.equal(queue.isEmpty, false);
  t.equal(task.fn, fn);

  queue.clear();
  t.equal(queue.isEmpty, true);

  const task1 = queue.enqueue(fn1);
  const task2 = queue.enqueue(fn2);
  t.equal(task1.fn, fn1);
  t.equal(task2.fn, fn2);

  queue.dequeue(task2);
  t.equal(queue.isEmpty, false);
  queue.dequeue(task1);
  t.equal(queue.isEmpty, true);
});

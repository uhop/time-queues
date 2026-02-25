import test from 'tape-six';

import type {Task} from '../src/ListQueue.js';
import ListQueue from '../src/ListQueue.js';
import {MicroTask} from '../src/MicroTask.js';
import {MicroTaskQueue} from '../src/MicroTaskQueue.js';

test('TS: ListQueue extends MicroTaskQueue', t => {
  const queue = new ListQueue();
  const asMTQ: MicroTaskQueue = queue;
  t.ok(asMTQ);
});

test('TS: ListQueue.Task is MicroTask', t => {
  const task: Task = new MicroTask(() => {});
  t.ok(task);
});

test('TS: ListQueue method return types for chaining', t => {
  const queue = new ListQueue();
  const task = queue.enqueue(() => {});

  const q1: ListQueue = queue.dequeue(task);
  const q2: ListQueue = queue.clear();
  const q3: ListQueue = queue.pause();
  const q4: ListQueue = queue.resume();

  t.equal(q1, queue);
  t.equal(q2, queue);
  t.equal(q3, queue);
  t.equal(q4, queue);
});

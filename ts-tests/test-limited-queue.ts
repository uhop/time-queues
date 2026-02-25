import test from 'tape-six';

import type {Task} from '../src/LimitedQueue.js';
import {LimitedQueue} from '../src/LimitedQueue.js';
import ListQueue from '../src/ListQueue.js';

test('TS: LimitedQueue extends ListQueue', t => {
  const queue = new LimitedQueue(3);
  const asLQ: ListQueue = queue;
  t.ok(asLQ);
});

test('TS: LimitedQueue property and getter types', t => {
  const queue = new LimitedQueue(3);

  const limit: number = queue.taskLimit;
  const active: number = queue.activeTasks;
  const idle: boolean = queue.isIdle;
  const empty: boolean = queue.isEmpty;

  queue.taskLimit = 5;

  t.equal(typeof limit, 'number');
  t.equal(typeof active, 'number');
  t.equal(typeof idle, 'boolean');
  t.equal(typeof empty, 'boolean');
});

test('TS: LimitedQueue.waitForIdle() returns Promise<void>', async t => {
  const queue = new LimitedQueue(3);
  const p: Promise<void> = queue.waitForIdle();
  await p;
  t.ok(true);
});

test('TS: LimitedQueue.schedule() returns Task with promise', async t => {
  const queue = new LimitedQueue(3);
  const task: Task = queue.schedule(() => 42);
  const p: Promise<unknown> | null = task.promise;
  t.ok(p instanceof Promise);
  await p;
});

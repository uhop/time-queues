'use strict';

import test from 'tape-six';

import {Scheduler, repeat} from '../src/Scheduler.js';
import sleep from '../src/sleep.js';

test('Scheduler: async task execution', async t => {
  const scheduler = new Scheduler();
  const results = [];

  scheduler.enqueue(({task, scheduler}) => {
    results.push('a');
  }, 30);

  scheduler.enqueue(({task, scheduler}) => {
    results.push('b');
  }, 10);

  scheduler.enqueue(({task, scheduler}) => {
    results.push('c');
  }, 20);

  t.deepEqual(results, []);
  await sleep(50);
  t.deepEqual(results, ['b', 'c', 'a']);
  t.ok(scheduler.isEmpty);
});

test('Scheduler: schedule() with promise', async t => {
  const scheduler = new Scheduler();

  const task = scheduler.schedule(() => 42, 10);
  t.ok(task.promise instanceof Promise);

  const value = await task.promise;
  t.equal(value, 42);
  t.ok(scheduler.isEmpty);
});

test('Scheduler: repeat()', async t => {
  const scheduler = new Scheduler();
  const results = [];
  let stopped = false;

  const fn = ({task, scheduler}) => {
    results.push(results.length + 1);
    if (results.length >= 3) stopped = true;
  };

  const wrappedFn = ({task, scheduler}) => {
    fn({task, scheduler});
    if (!stopped) scheduler.enqueue(wrappedFn, 15);
  };

  scheduler.enqueue(wrappedFn, 15);

  await sleep(100);
  t.equal(results.length, 3);
  t.deepEqual(results, [1, 2, 3]);
  t.ok(scheduler.isEmpty);
});

test('Scheduler: clear() returns this', t => {
  const scheduler = new Scheduler();
  scheduler.enqueue(() => {}, 100);
  const result = scheduler.clear();
  t.equal(result, scheduler);
  t.ok(scheduler.isEmpty);
});

test('Scheduler: enqueue with Date', async t => {
  const scheduler = new Scheduler();
  const results = [];

  scheduler.enqueue(() => results.push('done'), new Date(Date.now() + 15));

  t.deepEqual(results, []);
  await sleep(30);
  t.deepEqual(results, ['done']);
});

test('Scheduler: pause/resume delays execution', async t => {
  const scheduler = new Scheduler();
  const results = [];

  scheduler.pause();
  scheduler.enqueue(() => results.push('a'), 10);

  await sleep(30);
  t.deepEqual(results, []);

  scheduler.resume();
  await sleep(30);
  t.deepEqual(results, ['a']);
});

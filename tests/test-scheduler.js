'use strict';

import test from 'tape-six';

import scheduler from '../src/Scheduler.js';

test('Scheduler', t => {
  t.equal(typeof scheduler, 'object');
  t.equal(scheduler.isEmpty, true);
  t.equal(scheduler.nextTime, Infinity);
  t.equal(scheduler.paused, false);

  scheduler.pause();
  t.equal(scheduler.paused, true);
  scheduler.resume();
  t.equal(scheduler.paused, false);

  const fn1 = () => 1, fn2 = () => 2;

  const task1 = scheduler.enqueue(fn1, 200);
  t.equal(task1.fn, fn1);
  t.equal(scheduler.nextTime, task1.time);

  const task2 = scheduler.enqueue(fn2, 100);
  t.equal(task2.fn, fn2);
  t.equal(scheduler.nextTime, task2.time);

  scheduler.dequeue(task2);
  t.equal(scheduler.nextTime, task1.time);
  scheduler.dequeue(task1);
  t.equal(scheduler.nextTime, Infinity);
  t.equal(scheduler.isEmpty, true);

  scheduler.enqueue(fn1, 200);
  t.equal(scheduler.isEmpty, false);
  scheduler.enqueue(fn2, 100);
  t.equal(scheduler.isEmpty, false);

  scheduler.clear();
  t.equal(scheduler.isEmpty, true);
  t.equal(scheduler.nextTime, Infinity);
});

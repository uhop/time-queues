import test from 'tape-six';

import scheduler from '../src/Scheduler.js';

test('Scheduler', t => {
  t.equal(typeof scheduler, 'object');
  t.ok(scheduler.isEmpty);
  t.equal(scheduler.nextTime, Infinity);
  t.notOk(scheduler.paused);

  scheduler.pause();
  t.ok(scheduler.paused);
  scheduler.resume();
  t.notOk(scheduler.paused);

  const fn1 = () => 1,
    fn2 = () => 2;

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
  t.ok(scheduler.isEmpty);

  scheduler.enqueue(fn1, 200);
  t.notOk(scheduler.isEmpty);
  scheduler.enqueue(fn2, 100);
  t.notOk(scheduler.isEmpty);

  scheduler.clear();
  t.ok(scheduler.isEmpty);
  t.equal(scheduler.nextTime, Infinity);
});

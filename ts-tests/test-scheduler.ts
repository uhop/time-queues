import test from 'tape-six';

import {Scheduler, Task, repeat, scheduler} from '../src/Scheduler.js';
import {MicroTaskQueue} from '../src/MicroTaskQueue.js';

test('TS: Scheduler is instanceof MicroTaskQueue', t => {
  const s = new Scheduler();
  t.ok(s instanceof MicroTaskQueue);
});

test('TS: Task callback receives {task, scheduler}', t => {
  const s = new Scheduler();
  const task: Task = s.enqueue(({task, scheduler: sched}) => {
    const _t: Task = task;
    const _s: Scheduler = sched;
    void _t;
    void _s;
  }, 1000);

  const time: number = task.time;
  const delay: number = task.delay;

  s.clear();
  t.equal(typeof time, 'number');
  t.equal(typeof delay, 'number');
});

test('TS: Scheduler.enqueue() delay accepts number or Date', t => {
  const s = new Scheduler();
  s.enqueue(() => {}, 100);
  s.enqueue(() => {}, new Date(Date.now() + 100));
  s.clear();
  t.ok(true);
});

test('TS: Scheduler.schedule() with null fn returns Task with promise', async t => {
  const s = new Scheduler();
  const task: Task = s.schedule(null, 10);
  const p: Promise<unknown> | null = task.promise;
  t.ok(p instanceof Promise);
  await p;
});

test('TS: repeat() returns a scheduler callback', t => {
  const fn = repeat(({task, scheduler: _s}) => {
    void task;
  }, 100);

  const s = new Scheduler();
  s.enqueue(fn, 100);
  s.clear();
  t.equal(typeof fn, 'function');
});

test('TS: default export is scheduler instance', t => {
  const s: Scheduler = scheduler;
  t.ok(s instanceof Scheduler);
});

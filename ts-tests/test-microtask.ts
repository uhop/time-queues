import test from 'tape-six';

import {MicroTask} from '../src/MicroTask.js';

test('TS: MicroTask constructor and property types', t => {
  const fn = () => 42;
  const task: MicroTask = new MicroTask(fn);

  const taskFn: (...args: any[]) => unknown = task.fn;
  const canceled: boolean = task.isCanceled;
  const promise: Promise<unknown> | null = task.promise;
  const settled: boolean = task.settled;

  t.equal(taskFn, fn);
  t.equal(canceled, false);
  t.equal(promise, null);
  t.equal(settled, false);
});

test('TS: MicroTask.makePromise() returns this', t => {
  const task = new MicroTask(() => {});
  const result: MicroTask = task.makePromise();
  t.equal(result, task);
  t.ok(task.promise instanceof Promise);
});

test('TS: MicroTask.resolve() returns this', t => {
  const task = new MicroTask(() => {});
  const result: MicroTask = task.resolve(42);
  t.equal(result, task);
});

test('TS: MicroTask.cancel() accepts optional Error', t => {
  const task = new MicroTask(() => {});
  const r1: MicroTask = task.cancel();
  t.equal(r1, task);

  const task2 = new MicroTask(() => {});
  const r2: MicroTask = task2.cancel(new Error('reason'));
  t.equal(r2, task2);
});

'use strict';

import test from 'tape-six';

import MicroTask from '../src/MicroTask.js';
import CancelTaskError from '../src/CancelTaskError.js';

test('MicroTask: basic creation', t => {
  const fn = () => 42;
  const task = new MicroTask(fn);

  t.equal(task.fn, fn);
  t.equal(task.promise, null);
  t.equal(task.settled, false);
  t.equal(task.isCanceled, false);
});

test('MicroTask: makePromise()', t => {
  const task = new MicroTask(() => {});

  const result = task.makePromise();
  t.equal(result, task);
  t.ok(task.promise instanceof Promise);

  const promise = task.promise;
  task.makePromise();
  t.equal(task.promise, promise);
});

test('MicroTask: resolve()', async t => {
  const task = new MicroTask(() => {});
  task.makePromise();

  task.resolve(42);
  t.equal(task.settled, true);
  t.equal(await task.promise, 42);

  task.resolve(99);
  t.equal(await task.promise, 42);
});

test('MicroTask: cancel()', async t => {
  const task = new MicroTask(() => {});
  task.makePromise();

  task.cancel();
  t.equal(task.isCanceled, true);
  t.equal(task.settled, true);

  try {
    await task.promise;
    t.fail('should have thrown');
  } catch (error) {
    t.ok(error instanceof CancelTaskError);
    t.equal(error.cause, undefined);
  }
});

test('MicroTask: cancel() with cause', async t => {
  const task = new MicroTask(() => {});
  task.makePromise();

  const cause = new Error('reason');
  task.cancel(cause);

  try {
    await task.promise;
    t.fail('should have thrown');
  } catch (error) {
    t.ok(error instanceof CancelTaskError);
    t.equal(error.cause, cause);
  }
});

test('MicroTask: cancel() without promise', t => {
  const task = new MicroTask(() => {});

  task.cancel();
  t.equal(task.isCanceled, true);
  t.equal(task.settled, false);
});

test('MicroTask: resolve() without promise', t => {
  const task = new MicroTask(() => {});

  task.resolve(42);
  t.equal(task.settled, false);
});

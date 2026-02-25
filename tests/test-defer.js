'use strict';

import test from 'tape-six';

import defer, {scheduleDefer} from '../src/defer.js';

test('defer', async t => {
  t.equal(typeof defer, 'function');

  let results = [];

  defer(() => results.push(1));
  t.deepEqual(results, []);

  await new Promise(resolve => {
    defer(() => {
      t.deepEqual(results, [1]);
      resolve();
    });
  });
});

test('scheduleDefer: returns promise', async t => {
  t.equal(typeof scheduleDefer, 'function');

  const result = await scheduleDefer(() => 42);
  t.equal(result, 42);
});

test('scheduleDefer: null fn returns args', async t => {
  const result = await scheduleDefer(null);
  t.deepEqual(result, []);
});

test('scheduleDefer: rejects on error', async t => {
  const error = new Error('boom');
  try {
    await scheduleDefer(() => {
      throw error;
    });
    t.fail('should have thrown');
  } catch (e) {
    t.equal(e, error);
  }
});

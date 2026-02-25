'use strict';

import test from 'tape-six';

import CancelTaskError from '../src/CancelTaskError.js';

test('CancelTaskError: default message', t => {
  const error = new CancelTaskError();

  t.ok(error instanceof Error);
  t.ok(error instanceof CancelTaskError);
  t.equal(error.name, 'CancelTaskError');
  t.equal(error.message, 'Task was canceled');
  t.equal(error.cause, undefined);
});

test('CancelTaskError: custom message', t => {
  const error = new CancelTaskError('custom');

  t.equal(error.message, 'custom');
  t.equal(error.cause, undefined);
});

test('CancelTaskError: with cause', t => {
  const cause = new Error('root cause');
  const error = new CancelTaskError(undefined, {cause});

  t.equal(error.message, 'Task was canceled');
  t.equal(error.cause, cause);
});

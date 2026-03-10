import test from 'tape-six';

import CancelTaskError from '../src/CancelTaskError.js';

test('TS: CancelTaskError extends Error', t => {
  const error: CancelTaskError = new CancelTaskError();
  const asError: Error = error;

  t.ok(asError instanceof Error);
  t.ok(error instanceof CancelTaskError);
});

test('TS: CancelTaskError.name is literal type', t => {
  const error = new CancelTaskError();
  const name: 'CancelTaskError' = error.name;
  t.equal(name, 'CancelTaskError');
});

test('TS: CancelTaskError constructor overloads', t => {
  const e1 = new CancelTaskError();
  const e2 = new CancelTaskError('custom');
  const e3 = new CancelTaskError(undefined, {cause: new Error('root')});
  const e4 = new CancelTaskError('msg', {cause: 'any cause'});

  t.ok(e1);
  t.ok(e2);
  t.ok(e3);
  t.ok(e4);
});

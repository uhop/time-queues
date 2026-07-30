import test from 'tape-six';

import waitFor from 'time-queues/wait-for.js';

test('waitFor: already-truthy predicate resolves immediately with its value', async t => {
  const value = await waitFor(() => 42);
  t.equal(value, 42, 'the truthy value is passed through');
});

test('waitFor: polls until the predicate turns truthy', async t => {
  let calls = 0;
  const value = await waitFor(() => ++calls >= 3 && 'ready', {interval: 5});
  t.equal(value, 'ready', 'resolves with the first truthy result');
  t.equal(calls, 3, 'the predicate was polled');
});

test('waitFor: supports async predicates', async t => {
  let flag = false;
  setTimeout(() => (flag = true), 20);
  const value = await waitFor(async () => flag, {interval: 5});
  t.equal(value, true, 'resolves when the async predicate turns truthy');
});

test('waitFor: rejects on timeout', async t => {
  await t.rejects(
    waitFor(() => false, {timeout: 20, interval: 5}),
    'times out'
  );
});

test('waitFor: rejects with signal.reason on abort', async t => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(new Error('stop')), 15);
  await t.rejects(
    waitFor(() => false, {interval: 5, signal: controller.signal}),
    'aborted'
  );
});

test('waitFor: a pre-aborted signal rejects immediately', async t => {
  const controller = new AbortController();
  controller.abort();
  await t.rejects(
    waitFor(() => true, {signal: controller.signal}),
    'already aborted'
  );
});

test('waitFor: a throwing predicate rejects with that error', async t => {
  await t.rejects(
    waitFor(() => {
      throw new Error('boom');
    }),
    'predicate error propagates'
  );
});

test('waitFor: a rejecting async predicate rejects the wait', async t => {
  await t.rejects(
    waitFor(async () => {
      throw new Error('boom');
    }),
    'async predicate error propagates'
  );
});

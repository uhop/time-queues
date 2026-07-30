import test from 'tape-six';

import {whenLoaded, scheduleWhenLoaded, remove} from 'time-queues/when-loaded.js';
import {
  whenDomLoaded,
  scheduleWhenDomLoaded,
  remove as removeDom
} from 'time-queues/when-dom-loaded.js';

const microtasks = () => new Promise(resolve => setTimeout(resolve, 0));

test('whenLoaded: dispatches immediately on an already-loaded page', async t => {
  t.equal(document.readyState, 'complete', 'the test page is fully loaded');
  let called = 0;
  whenLoaded(() => ++called);
  t.equal(called, 0, 'not synchronous');
  await microtasks();
  t.equal(called, 1, 'dispatched via microtask');
});

test('whenLoaded: remove(fn) unsubscribes before dispatch', async t => {
  let called = 0;
  const fn = () => ++called;
  whenLoaded(fn);
  t.ok(remove(fn), 'remove finds the pending callback');
  t.notOk(remove(fn), 'a second remove finds nothing');
  await microtasks();
  t.equal(called, 0, 'the removed callback never ran');
});

test('whenLoaded: scheduleWhenLoaded resolves with the callback result', async t => {
  const value = await scheduleWhenLoaded(() => 42);
  t.equal(value, 42);
});

test('whenLoaded: scheduleWhenLoaded rejects when the callback throws', async t => {
  await t.rejects(
    scheduleWhenLoaded(() => {
      throw new Error('boom');
    }),
    'callback error propagates'
  );
});

test('whenDomLoaded: dispatches immediately on an already-parsed page', async t => {
  let called = 0;
  whenDomLoaded(() => ++called);
  await microtasks();
  t.equal(called, 1, 'dispatched via microtask');
});

test('whenDomLoaded: remove(fn) unsubscribes before dispatch', async t => {
  let called = 0;
  const fn = () => ++called;
  whenDomLoaded(fn);
  t.ok(removeDom(fn), 'remove finds the pending callback');
  await microtasks();
  t.equal(called, 0, 'the removed callback never ran');
});

test('whenDomLoaded: scheduleWhenDomLoaded resolves with the callback result', async t => {
  const value = await scheduleWhenDomLoaded(() => 'ready');
  t.equal(value, 'ready');
});

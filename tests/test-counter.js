'use strict';

import test from 'tape-six';

import Counter from '../src/Counter.js';
import sleep from '../src/sleep.js';

test('Counter', async t => {
  t.equal(typeof Counter, 'function');

  const counter = new Counter();
  t.equal(typeof counter, 'object');
  t.equal(counter.count, 0);
  t.equal(counter.value, 0);

  counter.increment();
  t.equal(counter.value, 1);

  counter.decrement();
  t.equal(counter.value, 0);

  counter.advance(2);
  t.equal(counter.value, 2);

  counter.clearWaiters();
  t.equal(counter.value, 2);

  setTimeout(async () => {
    counter.decrement();
    t.equal(counter.value, 1);
    await sleep(10);
    counter.decrement();
    t.equal(counter.value, 0);
  }, 10);

  await counter.waitForZero();
  t.equal(counter.value, 0);

  setTimeout(() => {
    counter.increment();
    t.equal(counter.value, 1);
  }, 10);

  await counter.waitFor(x => x === 1);
  t.equal(counter.value, 1);

  counter.clearWaiters();
  t.equal(counter.value, 1);

  setTimeout(() => {
    counter.decrement();
    t.equal(counter.value, 0);
  }, 10);

  await counter.waitForZero();
  t.equal(counter.value, 0);
});

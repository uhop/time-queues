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

test('Counter: initial value', t => {
  const counter = new Counter(5);
  t.equal(counter.value, 5);
  t.equal(counter.count, 5);
});

test('Counter: value setter', async t => {
  const counter = new Counter();

  counter.value = 10;
  t.equal(counter.value, 10);

  setTimeout(() => (counter.value = 0), 10);
  await counter.waitForZero();
  t.equal(counter.value, 0);
});

test('Counter: advance with negative', t => {
  const counter = new Counter(5);
  counter.advance(-3);
  t.equal(counter.value, 2);
});

test('Counter: clearWaiters resolves with NaN', async t => {
  const counter = new Counter(1);

  const p = counter.waitForZero();
  counter.clearWaiters();
  const result = await p;
  t.ok(Number.isNaN(result));
});

test('Counter: waitFor resolves immediately if true', async t => {
  const counter = new Counter(5);
  const result = await counter.waitFor(x => x === 5);
  t.equal(result, 5);
});

test('Counter: waitForZero resolves immediately if zero', async t => {
  const counter = new Counter(0);
  const result = await counter.waitForZero();
  t.equal(result, 0);
});

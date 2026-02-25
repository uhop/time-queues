import test from 'tape-six';

import Counter from '../src/Counter.js';

test('TS: Counter property and method types', t => {
  const counter = new Counter();

  const count: number = counter.count;
  const value: number = counter.value;
  counter.value = 5;

  counter.increment();
  counter.decrement();
  counter.advance(2);
  counter.clearWaiters();

  t.equal(typeof count, 'number');
  t.equal(typeof value, 'number');
});

test('TS: Counter.waitFor() callback signature', async t => {
  const counter = new Counter();

  const p1: Promise<number> = counter.waitForZero();
  const p2: Promise<number> = counter.waitFor((count: number) => count === 0);

  if (0 as number) {
    // @ts-expect-error — callback must return boolean
    counter.waitFor((count: number) => count);
  }

  const r1 = await p1;
  t.equal(typeof r1, 'number');
  await p2;
});

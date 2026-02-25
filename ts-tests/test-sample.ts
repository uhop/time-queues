import test from 'tape-six';

import sample from '../src/sample.js';
import sleep from '../src/sleep.js';

test('sample', async t => {
  t.equal(typeof sample, 'function');

  const results: number[] = [];
  const fn = (x: number) => results.push(x),
    sampledFn = sample(fn, 20);

  sampledFn(1);
  t.deepEqual(results, []);

  await sleep(10);
  sampledFn(2);
  t.deepEqual(results, []);

  await sleep(20);
  t.deepEqual(results, [2]);

  sampledFn(3);
  t.deepEqual(results, [2]);

  await sleep(20);
  t.deepEqual(results, [2, 3]);
});

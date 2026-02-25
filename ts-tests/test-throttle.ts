import test from 'tape-six';

import throttle from '../src/throttle.js';
import sleep from '../src/sleep.js';

test('throttle', async t => {
  t.equal(typeof throttle, 'function');

  let results: number[] = [];
  const fn = (x: number) => results.push(x),
    throttledFn = throttle(fn, 20);

  throttledFn(1);
  t.deepEqual(results, [1]);

  await sleep(10);
  throttledFn(2);
  t.deepEqual(results, [1]);

  results = [];
  await sleep(20);
  t.deepEqual(results, []);
});

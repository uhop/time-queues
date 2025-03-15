'use strict';

import test from 'tape-six';

import debounce from '../src/debounce.js';
import sleep from '../src/sleep.js';

test('debounce', async t => {
  t.equal(typeof debounce, 'function');

  let results = [];
  const fn = x => results.push(x),
    debouncedFn = debounce(fn, 20);

  debouncedFn(1);
  await sleep(10);
  debouncedFn(2);
  await sleep(10);
  debouncedFn(3);

  t.deepEqual(results, []);

  await sleep(10);
  t.deepEqual(results, []);

  await sleep(20);
  t.deepEqual(results, [3]);
});

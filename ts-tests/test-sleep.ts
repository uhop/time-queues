'use strict';

import test from 'tape-six';

import sleep from '../src/sleep.js';

test('sleep', async t => {
  t.equal(typeof sleep, 'function');

  const results: number[] = [];
  await Promise.all([
    sleep(30).then(() => results.push(3)),
    sleep(50).then(() => results.push(5)),
    sleep(10).then(() => results.push(1)),
    sleep(40).then(() => results.push(4)),
    sleep(20).then(() => results.push(2))
  ]);
  t.deepEqual(results, [1, 2, 3, 4, 5]);
});

'use strict';

import test from 'tape-six';

import defer from '../src/defer.js';

test('defer', async t => {
  t.equal(typeof defer, 'function');

  let results = [];

  defer(() => results.push(1));
  t.deepEqual(results, []);

  await new Promise(resolve => {
    defer(() => {
      t.deepEqual(results, [1]);
      resolve();
    });
  });
});

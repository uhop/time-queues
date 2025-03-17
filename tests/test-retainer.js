'use strict';

import test from 'tape-six';

import Retainer from '../src/Retainer.js';
import sleep from '../src/sleep.js';

test('Retainer', async t => {
  t.equal(typeof Retainer, 'function');

  const retainer = new Retainer({
    create: () => 1,
    destroy: () => {},
    retentionPeriod: 10
  });
  t.equal(typeof retainer, 'object');
  t.equal(retainer.counter, 0);
  t.equal(retainer.value, null);

  const value1 = await retainer.get();
  t.equal(value1, 1);
  t.equal(retainer.counter, 1);

  const value2 = await retainer.get();
  t.equal(value2, 1);
  t.equal(retainer.counter, 2);

  t.equal(retainer.value, 1);

  await retainer.release();
  t.equal(retainer.counter, 1);

  await retainer.release();
  t.equal(retainer.counter, 0);

  t.equal(retainer.value, 1);

  await sleep(5);
  t.equal(retainer.value, 1);

  await sleep(10);
  t.equal(retainer.value, null);
});

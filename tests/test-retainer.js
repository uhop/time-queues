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
  const isOne = retainer.value === 1,
    isNull = retainer.value === null;
  t.ok(isOne || isNull);

  await sleep(10);
  t.equal(retainer.value, null);
});

test('Retainer: immediate release', async t => {
  let destroyed = null;
  const retainer = new Retainer({
    create: () => 'resource',
    destroy: v => (destroyed = v),
    retentionPeriod: 1000
  });

  await retainer.get();
  t.equal(retainer.value, 'resource');

  await retainer.release(true);
  t.equal(retainer.value, null);
  t.equal(destroyed, 'resource');
});

test('Retainer: over-release throws', async t => {
  const retainer = new Retainer({
    create: () => 1,
    destroy: () => {},
    retentionPeriod: 10
  });

  try {
    await retainer.release();
    t.fail('should have thrown');
  } catch (e) {
    t.ok(e instanceof Error);
    t.ok(e.message.includes('zero'));
  }
});

test('Retainer: re-get during retention reuses value', async t => {
  let createCount = 0;
  const retainer = new Retainer({
    create: () => ++createCount,
    destroy: () => {},
    retentionPeriod: 50
  });

  const v1 = await retainer.get();
  t.equal(v1, 1);
  await retainer.release();

  await sleep(10);
  const v2 = await retainer.get();
  t.equal(v2, 1);
  t.equal(createCount, 1);

  await retainer.release(true);
});

test('Retainer: requires create and destroy', t => {
  try {
    new Retainer({});
    t.fail('should have thrown');
  } catch (e) {
    t.ok(e instanceof Error);
  }
});

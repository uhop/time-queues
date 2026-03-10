import test from 'tape-six';

import Throttler from '../src/Throttler.js';
import sleep from '../src/sleep.js';

const THROTTLE_TIMEOUT = 10;

test('Throttler', async t => {
  t.equal(typeof Throttler, 'function');

  const throttler = new Throttler({
    throttleTimeout: THROTTLE_TIMEOUT
  });
  t.equal(typeof throttler, 'object');

  t.equal(throttler.throttleTimeout, THROTTLE_TIMEOUT);
  t.equal(throttler.neverSeenTimeout, 0);
  t.equal(throttler.vacuumPeriod, 30);

  t.equal(throttler.lastSeen.size, 0);

  t.equal(throttler.getLastSeen('a'), 0);
  t.equal(throttler.getLastSeen('b'), 0);

  const delay1 = throttler.getDelay('a');
  t.equal(delay1, 0);
  t.ok(throttler.getLastSeen('a') > 0);

  const delay2 = throttler.getDelay('b');
  t.equal(delay2, 0);
  t.ok(throttler.getLastSeen('b') > 0);

  t.equal(throttler.lastSeen.size, 2);

  const delay3 = throttler.getDelay('a');
  t.ok(delay3 > 0 && delay3 <= 2 * THROTTLE_TIMEOUT);
  t.ok(throttler.getLastSeen('a') > 0);

  t.equal(throttler.lastSeen.size, 2);

  await sleep(4 * THROTTLE_TIMEOUT);
  t.equal(throttler.getLastSeen('a'), 0);
  t.equal(throttler.getLastSeen('b'), 0);

  t.equal(throttler.lastSeen.size, 0);

  throttler.stopVacuum();
});

test('Throttler: neverSeenTimeout', t => {
  const throttler = new Throttler({
    throttleTimeout: 100,
    neverSeenTimeout: 50
  });

  const delay = throttler.getDelay('new-key');
  t.equal(delay, 50);

  throttler.stopVacuum();
});

test('Throttler: wait()', async t => {
  const throttler = new Throttler({throttleTimeout: 10});

  const start = Date.now();
  await throttler.wait('x');
  const elapsed1 = Date.now() - start;
  t.ok(elapsed1 < 10);

  const start2 = Date.now();
  await throttler.wait('x');
  const elapsed2 = Date.now() - start2;
  t.ok(elapsed2 >= 5);

  throttler.stopVacuum();
});

test('Throttler: isVacuuming and start/stop chaining', t => {
  const throttler = new Throttler({throttleTimeout: 100, vacuumPeriod: 0});
  t.notOk(throttler.isVacuuming);

  const result1 = throttler.startVacuum();
  t.equal(result1, throttler);
  t.ok(throttler.isVacuuming);

  throttler.startVacuum();
  t.ok(throttler.isVacuuming);

  const result2 = throttler.stopVacuum();
  t.equal(result2, throttler);
  t.notOk(throttler.isVacuuming);

  throttler.stopVacuum();
  t.notOk(throttler.isVacuuming);
});

test('Throttler: no auto-vacuum when vacuumPeriod is 0', t => {
  const throttler = new Throttler({throttleTimeout: 10, vacuumPeriod: 0});
  t.notOk(throttler.isVacuuming);
});

test('Throttler: default options', t => {
  const throttler = new Throttler();
  t.equal(throttler.throttleTimeout, 1000);
  t.equal(throttler.neverSeenTimeout, 0);
  t.equal(throttler.vacuumPeriod, 3000);
  t.ok(throttler.isVacuuming);
  throttler.stopVacuum();
});

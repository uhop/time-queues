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

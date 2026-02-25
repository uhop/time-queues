import test from 'tape-six';

import Throttler from '../src/Throttler.js';

test('TS: Throttler constructor accepts partial options', t => {
  const t1 = new Throttler();
  const t2 = new Throttler({throttleTimeout: 500});
  const t3 = new Throttler({throttleTimeout: 500, neverSeenTimeout: 100, vacuumPeriod: 1500});

  t.ok(t1);
  t.ok(t2);
  t.ok(t3);
  t1.stopVacuum();
  t2.stopVacuum();
  t3.stopVacuum();
});

test('TS: Throttler method and property types', t => {
  const throttler = new Throttler();

  const lastSeen: number = throttler.getLastSeen('a');
  const delay: number = throttler.getDelay('a');
  const p: Promise<void> = throttler.wait('a');
  const isVac: boolean = throttler.isVacuuming;
  const self1: Throttler = throttler.startVacuum();
  const self2: Throttler = throttler.stopVacuum();
  const map: Map<unknown, number> = throttler.lastSeen;

  t.equal(typeof lastSeen, 'number');
  t.equal(typeof delay, 'number');
  t.ok(p instanceof Promise);
  t.equal(typeof isVac, 'boolean');
  t.equal(self1, throttler);
  t.equal(self2, throttler);
  t.ok(map instanceof Map);
});

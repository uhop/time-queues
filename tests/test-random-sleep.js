import test from 'tape-six';

import {
  randomUniformSleep,
  randomNormalSleep,
  randomExpoSleep,
  randomParetoSleep,
  randomSleep
} from '../src/random-sleep.js';

test('random sleep', async t => {
  t.equal(typeof randomUniformSleep, 'function');
  const u = randomUniformSleep(5, 15);
  t.equal(typeof u, 'function');
  await u();
  await u();

  t.equal(typeof randomNormalSleep, 'function');
  const n = randomNormalSleep(15, 5);
  t.equal(typeof n, 'function');
  await n();
  await n();

  t.equal(typeof randomExpoSleep, 'function');
  const e = randomExpoSleep(5, 15, 0.1);
  t.equal(typeof e, 'function');
  await e();
  await e();

  t.equal(typeof randomParetoSleep, 'function');
  const p = randomParetoSleep(5, 1.161);
  t.equal(typeof p, 'function');
  await p();
  await p();

  t.equal(typeof randomSleep, 'function');
  await randomSleep(20, 10);
});

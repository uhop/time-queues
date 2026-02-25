import test from 'tape-six';

import type {RandomSleepFunction} from '../src/random-sleep.js';
import {
  randomUniformSleep,
  randomNormalSleep,
  randomExpoSleep,
  randomParetoSleep,
  randomSleep
} from '../src/random-sleep.js';

test('TS: random-sleep factory return types', t => {
  const u: RandomSleepFunction = randomUniformSleep(5, 15);
  const n: RandomSleepFunction = randomNormalSleep(15, 5);
  const e: RandomSleepFunction = randomExpoSleep(0.1, 10, 5);
  const p: RandomSleepFunction = randomParetoSleep(5, 0.7);

  t.equal(typeof u, 'function');
  t.equal(typeof n, 'function');
  t.equal(typeof e, 'function');
  t.equal(typeof p, 'function');
});

test('TS: randomSleep() returns Promise<void> directly', async t => {
  const p: Promise<void> = randomSleep(10, 5);
  await p;
  t.ok(true);
});

test('TS: random-sleep optional parameters', async t => {
  const n: RandomSleepFunction = randomNormalSleep(15, 5);
  const e: RandomSleepFunction = randomExpoSleep(0.1, 10);
  const p: RandomSleepFunction = randomParetoSleep(5);

  await n();
  await e();
  await p();
  t.ok(true);
});

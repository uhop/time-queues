import test from 'tape-six';

import * as pkg from '../src/index.js';

test('index barrel: bare-import surface exposes all top-level symbols', t => {
  // Functions / classes
  for (const name of [
    'sleep',
    'defer',
    'scheduleDefer',
    'CancelTaskError',
    'MicroTask',
    'MicroTaskQueue',
    'ListQueue',
    'LimitedQueue',
    'FrameQueue',
    'IdleQueue',
    'PageWatcher',
    'Counter',
    'Retainer',
    'Throttler',
    'Scheduler',
    'SchedulerTask',
    'throttle',
    'debounce',
    'audit',
    'sample',
    'batch',
    'repeat',
    'uniform',
    'normal',
    'expo',
    'pareto',
    'randomSleep',
    'randomUniformSleep',
    'randomNormalSleep',
    'randomExpoSleep',
    'randomParetoSleep',
    'whenLoaded',
    'whenDomLoaded',
    'scheduleWhenLoaded',
    'scheduleWhenDomLoaded',
    'watchStates'
  ]) {
    t.equal(typeof pkg[name], 'function', `${name} should be a function`);
  }

  // Singletons
  t.equal(typeof pkg.frameQueue, 'object');
  t.equal(typeof pkg.idleQueue, 'object');
  t.equal(typeof pkg.pageWatcher, 'object');
  t.equal(typeof pkg.scheduler, 'object');
});

test('index barrel: re-exports work end-to-end', async t => {
  const start = Date.now();
  await pkg.sleep(10);
  t.ok(Date.now() - start >= 5);

  const counter = new pkg.Counter(0);
  counter.increment();
  t.equal(counter.value, 1);
});

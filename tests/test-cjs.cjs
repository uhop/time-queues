const {test} = require('tape-six');

const sleep = require('../src/sleep.js').default;
const {default: defer, scheduleDefer} = require('../src/defer.js');
const CancelTaskError = require('../src/CancelTaskError.js').default;
const {Scheduler} = require('../src/Scheduler.js');
const {LimitedQueue} = require('../src/LimitedQueue.js');
const Counter = require('../src/Counter.js').default;
const throttle = require('../src/throttle.js').default;
const debounce = require('../src/debounce.js').default;
const audit = require('../src/audit.js').default;
const sample = require('../src/sample.js').default;
const batch = require('../src/batch.js').default;
const Retainer = require('../src/Retainer.js').default;
const Throttler = require('../src/Throttler.js').default;
const {uniform, normal, expo, pareto} = require('../src/random-dist.js');
const {randomSleep} = require('../src/random-sleep.js');

test('CJS: require core modules', t => {
  t.equal(typeof sleep, 'function');
  t.equal(typeof defer, 'function');
  t.equal(typeof scheduleDefer, 'function');
  t.equal(typeof CancelTaskError, 'function');
});

test('CJS: use sleep()', async t => {
  const start = Date.now();
  await sleep(15);
  t.ok(Date.now() - start >= 10);
});

test('CJS: use Scheduler', async t => {
  const scheduler = new Scheduler();
  const results = [];

  scheduler.enqueue(() => results.push('a'), 10);
  scheduler.enqueue(() => results.push('b'), 20);

  await sleep(40);
  t.deepEqual(results, ['a', 'b']);
});

test('CJS: use LimitedQueue', async t => {
  const queue = new LimitedQueue(2);
  const result = await queue.schedule(() => 42).promise;
  t.equal(result, 42);

  await queue.waitForIdle();
  t.ok(queue.isIdle);
});

test('CJS: use Counter', t => {
  const counter = new Counter();
  counter.increment();
  t.equal(counter.value, 1);

  counter.decrement();
  t.equal(counter.value, 0);
});

test('CJS: use throttle/debounce/audit/sample', t => {
  t.equal(typeof throttle(() => {}, 10), 'function');
  t.equal(typeof debounce(() => {}, 10), 'function');
  t.equal(typeof audit(() => {}, 10), 'function');
  t.equal(typeof sample(() => {}, 10), 'function');
});

test('CJS: use batch()', async t => {
  const result = await batch([() => 1, () => 2, () => 3], 2);
  t.deepEqual(result, [1, 2, 3]);
});

test('CJS: use Retainer', async t => {
  const retainer = new Retainer({
    create: () => 'resource',
    destroy: () => {},
    retentionPeriod: 10
  });

  const value = await retainer.get();
  t.equal(value, 'resource');
  await retainer.release(true);
  t.equal(retainer.value, null);
});

test('CJS: use Throttler', t => {
  const throttler = new Throttler({throttleTimeout: 10, vacuumPeriod: 0});
  const delay = throttler.getDelay('key');
  t.equal(delay, 0);
});

test('CJS: use random-dist and random-sleep', async t => {
  t.equal(typeof uniform(0, 1), 'number');
  t.equal(typeof normal(0, 1), 'number');
  t.equal(typeof expo(1), 'number');
  t.equal(typeof pareto(1, 1), 'number');

  await randomSleep(10, 5);
  t.ok(true);
});

import test from 'tape-six';
import fc from 'fast-check';
import 'tape-six-fast-check';

import batch from 'time-queues/batch.js';

test('batch: concurrency stays within the limit and results keep input order', async t => {
  await t.prop(
    [fc.scheduler(), fc.integer({min: 1, max: 5}), fc.integer({min: 0, max: 12})],
    async (s, limit, n) => {
      let running = 0,
        high = 0;
      const fns = Array.from({length: n}, (_, i) => () => {
        ++running;
        high = Math.max(high, running);
        return s.schedule(Promise.resolve(i * 2), `op ${i}`).then(value => (--running, value));
      });
      const result = await s.waitFor(batch(fns, limit));
      return high <= limit && result.length === n && result.every((value, i) => value === i * 2);
    },
    'concurrency stays within the limit; results are ordered by input index'
  );
});

test('batch: a rejecting operation rejects the whole batch under any interleaving', async t => {
  await t.scheduler(async s => {
    const fns = Array.from(
      {length: 4},
      (_, i) => () =>
        i === 2
          ? s.schedule(Promise.reject(new Error('boom')), `op ${i}`)
          : s.schedule(Promise.resolve(i), `op ${i}`)
    );
    const outcome = batch(fns, 2).then(
      () => 'resolved',
      error => error.message
    );
    return (await s.waitFor(outcome)) === 'boom';
  }, 'the first rejection propagates');
});

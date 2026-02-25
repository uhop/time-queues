import test from 'tape-six';

import sample from '../src/sample.js';

test('TS: sample() preserves argument types', t => {
  const fn = (x: number, y: string) => {};
  const sampled = sample(fn, 20);

  sampled(1, 'a');

  if (0 as number) {
    // @ts-expect-error — wrong argument type
    sampled('bad', 'a');

    // @ts-expect-error — missing argument
    sampled(1);
  }

  t.equal(typeof sampled, 'function');
});

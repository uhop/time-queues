import test from 'tape-six';

import throttle from '../src/throttle.js';

test('TS: throttle() preserves argument types', t => {
  const fn = (x: number, y: string) => {};
  const throttled = throttle(fn, 20);

  throttled(1, 'a');

  if (0 as number) {
    // @ts-expect-error — wrong argument type
    throttled('bad', 'a');

    // @ts-expect-error — missing argument
    throttled(1);
  }

  t.equal(typeof throttled, 'function');
});

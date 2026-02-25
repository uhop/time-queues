import test from 'tape-six';

import debounce from '../src/debounce.js';

test('TS: debounce() preserves argument types', t => {
  const fn = (x: number, y: string) => {};
  const debounced = debounce(fn, 20);

  debounced(1, 'a');

  if (0 as number) {
    // @ts-expect-error — wrong argument type
    debounced('bad', 'a');

    // @ts-expect-error — missing argument
    debounced(1);
  }

  t.equal(typeof debounced, 'function');
});

import test from 'tape-six';

import audit from '../src/audit.js';

test('TS: audit() preserves argument types', t => {
  const fn = (x: number, y: string) => {};
  const audited = audit(fn, 20);

  audited(1, 'a');

  if (0 as number) {
    // @ts-expect-error — wrong argument type
    audited('bad', 'a');

    // @ts-expect-error — missing argument
    audited(1);
  }

  t.equal(typeof audited, 'function');
});

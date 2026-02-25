import test from 'tape-six';

import sleep from '../src/sleep.js';

test('TS: sleep() accepts number and Date', async t => {
  const p1: Promise<void> = sleep(10);
  const p2: Promise<void> = sleep(new Date(Date.now() + 10));

  if (0 as number) {
    // @ts-expect-error — string is not assignable
    sleep('10');
  }

  await Promise.all([p1, p2]);
  t.ok(true);
});

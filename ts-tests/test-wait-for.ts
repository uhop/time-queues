import test from 'tape-six';

import waitFor from '../src/wait-for.js';
import {waitFor as namedWaitFor} from '../src/wait-for.js';
import type {WaitForOptions} from '../src/wait-for.js';

test('TS: waitFor() types', async t => {
  const p1: Promise<number> = waitFor(() => 1);
  const p2: Promise<string> = waitFor(async () => 'ready', {
    timeout: 1000,
    interval: 5,
    signal: new AbortController().signal
  });

  const options: WaitForOptions = {interval: 5};
  const p3: Promise<boolean> = waitFor(() => true, options);

  if (0 as number) {
    // @ts-expect-error — the predicate must be a function
    waitFor(42);
    // @ts-expect-error — signal must be an AbortSignal
    waitFor(() => true, {signal: 42});
  }

  await Promise.all([p1, p2, p3]);
  t.equal(namedWaitFor, waitFor, 'named and default exports match');
});

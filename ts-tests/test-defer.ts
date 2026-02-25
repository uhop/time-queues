import test from 'tape-six';

import defer, {scheduleDefer} from '../src/defer.js';

test('TS: defer() returns void', t => {
  const result: void = defer(() => {});

  if (0 as number) {
    // @ts-expect-error — expects a function, not a string
    defer('bad');
  }

  t.equal(result, undefined);
});

test('TS: scheduleDefer() overload return types', async t => {
  const p1: Promise<number> = scheduleDefer(() => 42);
  const p2: Promise<void> = scheduleDefer(null);
  const p3: Promise<void> = scheduleDefer(undefined);

  const r1 = await p1;
  t.equal(r1, 42);
  await p2;
  await p3;
});

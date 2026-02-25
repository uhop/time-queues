import test from 'tape-six';

import Retainer from '../src/Retainer.js';

test('TS: Retainer generic type parameter', async t => {
  const retainer = new Retainer<number>({
    create: () => 1,
    destroy: () => {}
  });

  const value: number = await retainer.get();
  t.equal(value, 1);

  const stored: number | null = retainer.value;
  t.equal(stored, 1);

  const self: Promise<Retainer<number>> = retainer.release();
  await self;
});

test('TS: Retainer with async create/destroy', t => {
  const retainer = new Retainer<string>({
    create: async () => 'hello',
    destroy: async (_v: string) => {}
  });

  new Retainer<number>({
    create: () => 1,
    // @ts-expect-error — destroy expects number, not string
    destroy: (_v: string) => {}
  });

  t.ok(retainer);
});

test('TS: Retainer retentionPeriod is optional', t => {
  const r1 = new Retainer({create: () => 1, destroy: () => {}});
  const r2 = new Retainer({create: () => 1, destroy: () => {}, retentionPeriod: 500});

  t.ok(r1);
  t.ok(r2);
});

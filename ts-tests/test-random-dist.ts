import test from 'tape-six';

import {uniform, normal, expo, pareto} from '../src/random-dist.js';

test('TS: random-dist return types are number', t => {
  const u: number = uniform(0, 1);
  const n1: number = normal(0, 1);
  const n2: number = normal(0, 1, 0.5);
  const e: number = expo(1);
  const p: number = pareto(1, 1);

  t.equal(typeof u, 'number');
  t.equal(typeof n1, 'number');
  t.equal(typeof n2, 'number');
  t.equal(typeof e, 'number');
  t.equal(typeof p, 'number');
});

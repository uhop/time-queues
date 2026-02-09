import test from 'tape-six';

import {uniform, normal, expo, pareto} from '../src/random-dist.js';

test('random distributions', async t => {
  t.equal(typeof uniform, 'function');
  t.equal(typeof uniform(0, 1), 'number');

  t.equal(typeof normal, 'function');
  t.equal(typeof normal(0, 1), 'number');
  t.equal(typeof normal(0, 1, 1), 'number');

  t.equal(typeof expo, 'function');
  t.equal(typeof expo(1), 'number');

  t.equal(typeof pareto, 'function');
  t.equal(typeof pareto(1, 1), 'number');
});

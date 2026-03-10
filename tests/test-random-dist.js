import test from 'tape-six';

import {uniform, normal, expo, pareto} from '../src/random-dist.js';

test('random distributions: types', t => {
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

test('uniform: values within range', t => {
  for (let i = 0; i < 100; ++i) {
    const v = uniform(5, 10);
    t.ok(v >= 5 && v <= 10);
  }
});

test('uniform: reversed range', t => {
  for (let i = 0; i < 100; ++i) {
    const v = uniform(10, 5);
    t.ok(v >= 5 && v <= 10);
  }
});

test('expo: values non-negative', t => {
  for (let i = 0; i < 100; ++i) {
    t.ok(expo(1) >= 0);
  }
});

test('pareto: values >= min', t => {
  for (let i = 0; i < 100; ++i) {
    t.ok(pareto(3, 1) >= 3);
  }
});

import test from 'tape-six';

import audit from '../src/audit.js';
import sleep from '../src/sleep.js';

test('audit', async t => {
  t.equal(typeof audit, 'function');

  let results = [];
  const fn = x => results.push(x),
    auditedFn = audit(fn, 20);

  auditedFn(1);
  t.deepEqual(results, []);

  await sleep(10);
  auditedFn(2);
  t.deepEqual(results, []);

  await sleep(20);
  t.deepEqual(results, [2]);
});

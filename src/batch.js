// @ts-self-types="./batch.d.ts"

const wrap = value => {
  if (typeof value == 'function') return Promise.resolve(value());
  if (value && typeof value.then == 'function') return value; // thenable
  return Promise.resolve(value);
};

export const batch = (fns, limit = 4) => {
  if (!fns.length) return Promise.resolve([]);
  if (limit < 1) limit = 1;

  const result = [];
  let next = limit,
    available = limit;

  const saveResult = (index, resolve, reject) => value => {
    result[index] = value;
    if (next < fns.length) {
      wrap(fns[next]).then(saveResult(next, resolve, reject), reject);
      ++next;
    } else {
      ++available;
      if (available === limit) {
        // we are done
        resolve(result);
      }
    }
  };

  return new Promise((resolve, reject) => {
    // start the pump
    for (let i = 0, n = Math.min(fns.length, limit); i < n; ++i) {
      wrap(fns[i]).then(saveResult(i, resolve, reject), reject);
      --available;
    }
  });
};

export default batch;

'use strict';

export const audit = (fn, ms) => {
  let handle = null,
    lastSeenArgs = null;
  return (...args) => {
    lastSeenArgs = [...args];
    if (handle) return;
    handle = setTimeout(() => {
      handle = null;
      const args = lastSeenArgs;
      lastSeenArgs = null;
      fn(...args);
    }, ms);
  };
};

export default audit;

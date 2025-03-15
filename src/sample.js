'use strict';

export const sample = (fn, ms) => {
  const started = Date.now();
  let handle = null,
    lastSeenArgs = null,
    timeout = ms;
  return (...args) => {
    lastSeenArgs = [...args];
    if (handle) return;
    const diff = (Date.now() - started) % ms,
      delay = diff ? ms - diff : timeout;
    timeout = 0;
    handle = setTimeout(() => {
      handle = null;
      const args = lastSeenArgs;
      lastSeenArgs = null;
      fn(...args);
    }, delay);
  };
};

export default sample;

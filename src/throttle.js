// @ts-self-types="./throttle.d.ts"

'use strict';

export const throttle = (fn, ms) => {
  let handle = null;
  return (...args) => {
    if (handle) return;
    handle = setTimeout(() => (handle = null), ms);
    fn(...args);
  };
};

export default throttle;

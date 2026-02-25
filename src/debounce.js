// @ts-self-types="./debounce.d.ts"

export const debounce = (fn, ms) => {
  let handle = null;
  return (...args) => {
    if (handle) clearTimeout(handle);
    handle = setTimeout(() => {
      handle = null;
      fn(...args);
    }, ms);
  };
};

export default debounce;

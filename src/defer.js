// @ts-self-types="./defer.d.ts"

let deferImplementation = setTimeout;

if (typeof requestIdleCallback == 'function') {
  deferImplementation = requestIdleCallback;
} else if (typeof setImmediate == 'function') {
  deferImplementation = setImmediate;
}

export const defer = fn => void deferImplementation(() => fn());

const returnArgs = (...args) => args;

export const scheduleDefer = fn => {
  fn ||= returnArgs;
  return new Promise((resolve, reject) => {
    defer(() => {
      try {
        resolve(fn());
      } catch (error) {
        reject(error);
      }
    });
  });
};

export default defer;

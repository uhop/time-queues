'use strict';

let deferImplementation = setTimeout;

if (typeof requestIdleCallback == 'function') {
  deferImplementation = requestIdleCallback;
} else if (typeof setImmediate == 'function') {
  deferImplementation = setImmediate;
}

export const defer = fn => {
  deferImplementation(fn);
};

export default defer;

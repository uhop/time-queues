// @ts-self-types="./defer.d.ts"

'use strict';

let deferImplementation = setTimeout;

if (typeof requestIdleCallback == 'function') {
  deferImplementation = requestIdleCallback;
} else if (typeof setImmediate == 'function') {
  deferImplementation = setImmediate;
}

export const defer = fn => void deferImplementation(() => fn());

export default defer;

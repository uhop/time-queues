// @ts-self-types="./MicroTask.d.ts"

'use strict';

import CancelTaskError from './CancelTaskError.js';

export class MicroTask {
  #promise;
  #resolve;
  #reject;
  constructor(fn) {
    this.fn = fn;
    this.#promise = null;
    this.#resolve = null;
    this.#reject = null;
    this.isCanceled = false;
  }
  get promise() {
    return this.#promise;
  }
  makePromise() {
    this.#promise = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
    return this;
  }
  resolve(value) {
    if (!this.#resolve) return;
    this.#resolve(value);
    this.#resolve = null;
    this.#reject = null;
    return this;
  }
  cancel() {
    if (!this.#reject) return;
    this.isCanceled = true;
    this.#reject(new CancelTaskError());
    this.#resolve = null;
    this.#reject = null;
    return this;
  }
}

export default MicroTask;

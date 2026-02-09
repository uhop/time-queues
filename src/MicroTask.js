// @ts-self-types="./MicroTask.d.ts"

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
    if (this.#promise) return this;
    if (typeof Promise.withResolvers == 'function') {
      ({
        promise: this.#promise,
        resolve: this.#resolve,
        reject: this.#reject
      } = Promise.withResolvers());
    } else {
      this.#promise = new Promise((resolve, reject) => {
        this.#resolve = resolve;
        this.#reject = reject;
      });
    }
    return this;
  }
  resolve(value) {
    if (this.#resolve) {
      this.#resolve(value);
      this.#resolve = null;
      this.#reject = null;
    }
    return this;
  }
  cancel(error) {
    this.isCanceled = true;
    if (this.#reject) {
      this.#reject(new CancelTaskError(undefined, error ? {cause: error} : undefined));
      this.#resolve = null;
      this.#reject = null;
    }
    return this;
  }
}

export default MicroTask;

// @ts-self-types="./MicroTask.d.ts"

import CancelTaskError from './CancelTaskError.js';

export class MicroTask {
  #promise;
  #resolve;
  #reject;
  #settled;
  constructor(fn) {
    this.fn = fn;
    // AI-NOTE: Private fields initialized to null - lazy initialization pattern
    this.#promise = null;
    this.#resolve = null;
    this.#reject = null;
    this.#settled = false;
    this.isCanceled = false;
  }
  // AI-NOTE: Returns null until makePromise() is called - this is intentional
  get promise() {
    return this.#promise;
  }
  get settled() {
    return this.#settled;
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
    if (!this.#promise) {
      throw new Error('MicroTask: resolve() called before makePromise()');
    }
    if (this.#resolve) {
      this.#resolve(value);
      this.#resolve = null;
      this.#reject = null;
      this.#settled = true;
    }
    return this;
  }
  cancel(error) {
    this.isCanceled = true;
    if (this.#reject) {
      this.#reject(new CancelTaskError(undefined, error ? {cause: error} : undefined));
      this.#resolve = null;
      this.#reject = null;
      this.#settled = true;
    }
    return this;
  }
}

export default MicroTask;

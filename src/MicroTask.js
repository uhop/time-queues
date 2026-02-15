// @ts-self-types="./MicroTask.d.ts"

import CancelTaskError from './CancelTaskError.js';

/**
 * Base class for deferred task execution with lazy promise creation.
 * AI-NOTE: Promises are created lazily via makePromise() - not in constructor.
 * This allows tasks to be created without immediate promise overhead.
 */
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
    this.isCanceled = false;
  }
  // AI-NOTE: Returns null until makePromise() is called - this is intentional
  get promise() {
    return this.#promise;
  }
  get settled() {
    return this.#settled;
  }
  /**
   * Creates the promise and resolution functions.
   * AI-NOTE: Uses Promise.withResolvers() when available (modern environments),
   * falls back to manual Promise constructor for broader compatibility.
   */
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
      this.#settled = true;
    }
    return this;
  }
  /**
   * Cancel the task with optional error cause.
   * AI-NOTE: Always rejects with CancelTaskError to distinguish from other errors.
   */
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

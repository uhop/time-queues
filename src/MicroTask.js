// @ts-self-types="./MicroTask.d.ts"

import CancelTaskError from './CancelTaskError.js';

export class MicroTask {
  #promise;
  #resolve;
  #reject;
  #settled;
  #cancelError;
  constructor(fn) {
    this.fn = fn;
    this.#promise = null;
    this.#resolve = null;
    this.#reject = null;
    this.#settled = false;
    this.#cancelError = null;
    this.isCanceled = false;
  }
  get promise() {
    return this.#promise;
  }
  get settled() {
    return this.#settled;
  }
  get cancelError() {
    return this.#cancelError;
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
    if (this.isCanceled) {
      this.#reject(
        new CancelTaskError(undefined, this.#cancelError ? {cause: this.#cancelError} : undefined)
      );
      this.#resolve = null;
      this.#reject = null;
      this.#settled = true;
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
    if (error !== undefined && this.#cancelError === null) {
      this.#cancelError = error;
    }
    if (this.#reject) {
      this.#reject(
        new CancelTaskError(undefined, this.#cancelError ? {cause: this.#cancelError} : undefined)
      );
      this.#resolve = null;
      this.#reject = null;
      this.#settled = true;
    }
    return this;
  }
}

export default MicroTask;

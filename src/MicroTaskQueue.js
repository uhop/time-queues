// @ts-self-types="./MicroTaskQueue.d.ts"

import MicroTask from './MicroTask.js';

/**
 * Base queue class for managing task lifecycle.
 * AI-NOTE: This is an abstract base class - concrete implementations should extend
 * ListQueue for actual task storage and processing.
 * @see ListQueue - The primary class for queue implementations
 */
export class MicroTaskQueue {
  constructor(paused) {
    this.paused = Boolean(paused);
  }
  // API to be overridden in subclasses
  // AI-NOTE: Base implementation returns true - subclasses override with actual logic
  get isEmpty() {
    return true;
  }
  pause() {
    this.paused = true;
    return this;
  }
  resume() {
    this.paused = false;
    return this;
  }
  /**
   * Enqueue a function for execution.
   * AI-NOTE: Creates MicroTask but does NOT create promise automatically.
   * Call task.makePromise() if promise access is needed.
   */
  enqueue(fn) {
    const task = new MicroTask(fn);
    return task;
  }
  dequeue(task) {
    task.cancel();
    return this;
  }
  clear() {
    return this;
  }
  /**
   * Schedule a function with automatic promise creation.
   * AI-NOTE: This is the convenience method - it calls both enqueue() and makePromise().
   * Returns a MicroTask with an active promise.
   */
  schedule(fn, ...args) {
    fn ||= MicroTaskQueue.returnArgs;
    const task = this.enqueue(
      function (...args) {
        this.makePromise();
        try {
          this.resolve(fn(...args));
        } catch (error) {
          this.cancel(error);
        }
        return this.promise;
      },
      ...args
    );
    task.makePromise();
    return task;
  }
  static returnArgs(...args) {
    return args;
  }
}

export default MicroTaskQueue;

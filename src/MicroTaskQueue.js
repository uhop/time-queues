// @ts-self-types="./MicroTaskQueue.d.ts"

import MicroTask from './MicroTask.js';

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
  enqueue(fn, ..._args) {
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

// @ts-self-types="./MicroTaskQueue.d.ts"

'use strict';

import MicroTask from './MicroTask.js';

export class MicroTaskQueue {
  constructor(paused) {
    this.paused = Boolean(paused);
  }
  // API to be overridden in subclasses
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
  // Generic API
  schedule(fn, ...args) {
    fn ||= MicroTaskQueue.returnArgs;
    const task = this.enqueue(
      (...args) => {
        task.makePromise();
        try {
          task.resolve(fn(...args));
        } catch (error) {
          task.cancel();
        }
      },
      ...args
    );
    task.makePromise();
    task.fn = fn;
    return task;
  }
  static returnArgs(...args) {
    return args;
  }
}

export default MicroTaskQueue;

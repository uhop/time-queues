// @ts-self-types="./MicroTaskQueue.d.ts"

import MicroTask from './MicroTask.js';

const returnArgs = (...args) => args;

export class MicroTaskQueue {
  constructor(paused) {
    this.paused = Boolean(paused);
  }
  // overridden in subclasses
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
  schedule(fn, ...scheduleArgs) {
    fn ||= returnArgs;
    const task = this.enqueue(
      function (...invocationArgs) {
        this.makePromise();
        try {
          this.resolve(fn(...invocationArgs));
        } catch (error) {
          this.cancel(error);
        }
        return this.promise;
      },
      ...scheduleArgs
    );
    task.makePromise();
    return task;
  }
}

export default MicroTaskQueue;

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
    return this;
  }
  clear() {
    return this;
  }
}

export default MicroTaskQueue;

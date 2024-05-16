'use strict';

import List from 'list-toolkit/List.js';
import MicroTask from './MicroTask.js';

export class FrameQueue {
  constructor(paused, batchInMs) {
    this.list = new List();
    this.paused = Boolean(paused);
    this.handle = null;
    this.batch = batchInMs;
  }

  get isEmpty() {
    return this.list.isEmpty;
  }

  pause() {
    this.paused = true;
    if (this.handle) {
      cancelAnimationFrame(this.handle);
      this.handle = null;
    }
    return this;
  }

  resume() {
    if (this.paused) {
      this.paused = false;
      if (!this.list.isEmpty) {
        this.handle = requestAnimationFrame(this.processTasks.bind(this));
      }
    }
    return this;
  }

  enqueue(fn) {
    const task = new MicroTask(fn);
    this.list.pushBack(task);
    if (!this.paused && !this.handle) {
      this.handle = requestAnimationFrame(this.processTasks.bind(this));
    }
    return task;
  }

  dequeue(task) {
    for (const node of this.list.getNodeIterator()) {
      if (node.value === task) {
        this.list.remove(node);
        break;
      }
    }
    if (!this.paused && this.handle && this.list.isEmpty) {
      cancelAnimationFrame(this.handle);
      this.handle = null;
    }
    return this;
  }

  clear() {
    const paused = this.paused;
    if (!paused) this.pause();
    this.list.clear();
    if (!paused) this.resume();
    return this;
  }

  processTasks(timeStamp) {
    if (this.handle) {
      cancelAnimationFrame(this.handle);
      this.handle = null;
    }

    if (!isNaN(this.batch)) {
      const start = Date.now();
      while (Date.now() - start < this.batch && !this.list.isEmpty) {
        const task = this.list.popFront();
        task.fn(timeStamp, task, this);
      }
    } else {
      const list = this.list;
      this.list = new List();
      while (!list.isEmpty) {
        const task = list.popFront();
        task.fn(timeStamp, task, this);
      }
    }

    if (!this.list.isEmpty) {
      this.handle = requestAnimationFrame(this.processTasks.bind(this));
    }
  }
}

export const frameQueue = new FrameQueue();

export default frameQueue;

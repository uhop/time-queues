'use strict';

import List from 'list-toolkit/List.js';
import MicroTask from './MicroTask.js';

// Based on information from https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API

export class IdleQueue {
  constructor(paused, options, timeoutBatchInMs) {
    this.list = new List();
    this.paused = Boolean(paused);
    this.handle = null;
    this.options = options;
    this.timeoutBatch = timeoutBatchInMs;
  }

  get isEmpty() {
    return this.list.isEmpty;
  }

  pause() {
    this.paused = true;
    if (this.handle) {
      cancelIdleCallback(this.handle);
      this.handle = null;
    }
    return this;
  }

  resume() {
    if (this.paused) {
      this.paused = false;
      if (!this.list.isEmpty) {
        this.handle = requestIdleCallback(this.processTasks.bind(this), this.options);
      }
    }
    return this;
  }

  enqueue(fn) {
    const task = new MicroTask(fn);
    this.list.pushBack(task);
    if (!this.paused && !this.handle) {
      this.handle = requestIdleCallback(this.processTasks.bind(this), this.options);
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
      cancelIdleCallback(this.handle);
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

  processTasks(deadline) {
    if (this.handle) {
      cancelIdleCallback(this.handle);
      this.handle = null;
    }

    if (deadline.didTimeout) {
      if (!isNaN(this.timeoutBatch)) {
        const start = Date.now();
        while (Date.now() - start < this.timeoutBatch && !this.list.isEmpty) {
          const task = this.list.popFront();
          task.fn(deadline, task, this);
        }
      } else {
        const list = this.list;
        this.list = new List();
        while (!list.isEmpty) {
          const task = list.popFront();
          task.fn(deadline, task, this);
        }
      }
    } else {
      while (deadline.timeRemaining() > 0 && !this.list.isEmpty) {
        const task = this.list.popFront();
        task.fn(deadline, task, this);
      }
    }

    if (!this.list.isEmpty) {
      this.handle = requestIdleCallback(this.processTasks.bind(this), this.options);
    }
  }
}

export const idleQueue = new IdleQueue();

export const defer = idleQueue.enqueue.bind(idleQueue);

export default idleQueue;

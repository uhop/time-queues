'use strict';

import List from 'list-toolkit/list.js';
import MicroTaskQueue from './MicroTaskQueue.js';

export class ListQueue extends MicroTaskQueue {
  constructor(paused) {
    super(paused);
    this.list = new List();
    this.stopQueue = null;
  }

  get isEmpty() {
    return this.list.isEmpty;
  }

  pause() {
    if (!this.paused) {
      super.pause();
      if (this.stopQueue) this.stopQueue = (this.stopQueue(), null);
    }
    return this;
  }

  resume() {
    if (this.paused) {
      super.resume();
      if (!this.list.isEmpty) {
        this.stopQueue = this.startQueue();
      }
    }
    return this;
  }

  enqueue(fn) {
    const task = super.enqueue(fn);
    this.list.pushBack(task);
    if (!this.paused && !this.stopQueue) this.stopQueue = this.startQueue();
    return task;
  }

  dequeue(task) {
    for (const node of this.list.getNodeIterator()) {
      if (node.value === task) {
        List.pop(node);
        break;
      }
    }
    if (!this.paused && this.list.isEmpty && this.stopQueue)
      this.stopQueue = (this.stopQueue(), null);
    return this;
  }

  clear() {
    const paused = this.paused;
    if (!paused) this.pause();
    this.list.clear();
    if (!paused) this.resume();
    return this;
  }

  // API to be overridden in subclasses
  startQueue() {
    return null;
  }
}

export default ListQueue;

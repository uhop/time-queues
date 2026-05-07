// @ts-self-types="./ListQueue.d.ts"

import List from 'list-toolkit/list.js';
import MicroTask from './MicroTask.js';
import MicroTaskQueue from './MicroTaskQueue.js';

export class ListQueue extends MicroTaskQueue {
  constructor(paused) {
    super(paused);
    /** @type {List<MicroTask>} */
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
    task.cancel();
    this.list.removeNode(task);
    if (!this.paused && this.list.isEmpty && this.stopQueue)
      this.stopQueue = (this.stopQueue(), null);
    return this;
  }

  clear() {
    const paused = this.paused;
    if (!paused) this.pause();
    while (!this.list.isEmpty) {
      const task = this.list.popFront();
      task.cancel();
    }
    if (!paused) this.resume();
    return this;
  }

  startQueue() {
    return null;
  }

  // Drains pending tasks. If batchMs is a finite number, runs tasks until that
  // many milliseconds have elapsed; otherwise swaps in a fresh list and drains
  // the captured one entirely (so tasks enqueued during draining run on the
  // next tick rather than this one).
  _drainBatch(batchMs, taskContext) {
    if (!isNaN(batchMs)) {
      const start = Date.now();
      while (Date.now() - start < batchMs && !this.list.isEmpty) {
        const task = this.list.popFront();
        task.fn({...taskContext, task, queue: this});
      }
    } else {
      const list = this.list;
      this.list = new List();
      while (!list.isEmpty) {
        const task = list.popFront();
        task.fn({...taskContext, task, queue: this});
      }
    }
  }
}

export default ListQueue;

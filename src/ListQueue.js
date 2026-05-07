// @ts-self-types="./ListQueue.d.ts"

import List from 'list-toolkit/list.js';
import MicroTaskQueue from './MicroTaskQueue.js';

export class ListQueue extends MicroTaskQueue {
  constructor(paused) {
    super(paused);
    // AI-NOTE: Using list-toolkit List for O(1) push/pop operations
    this.list = new List();
    // AI-NOTE: stopQueue holds the stop function returned by startQueue(), or null
    this.stopQueue = null;
  }

  get isEmpty() {
    return this.list.isEmpty;
  }

  pause() {
    if (!this.paused) {
      super.pause();
      // AI-NOTE: Pattern: call stop function, then null it
      if (this.stopQueue) this.stopQueue = (this.stopQueue(), null);
    }
    return this;
  }

  resume() {
    if (this.paused) {
      super.resume();
      // AI-NOTE: Auto-start processing if tasks exist and not already running
      if (!this.list.isEmpty) {
        this.stopQueue = this.startQueue();
      }
    }
    return this;
  }

  enqueue(fn) {
    const task = super.enqueue(fn);
    this.list.pushBack(task);
    // AI-NOTE: Auto-start queue on first task if not paused and not running
    if (!this.paused && !this.stopQueue) this.stopQueue = this.startQueue();
    return task;
  }

  dequeue(task) {
    task.cancel();
    this.list.removeNode(task);
    // AI-NOTE: Auto-stop queue when empty (unless paused)
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
}

export default ListQueue;

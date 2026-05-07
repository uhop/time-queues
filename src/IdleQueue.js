// @ts-self-types="./IdleQueue.d.ts"

import ListQueue from './ListQueue.js';

// Based on information from https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API

export class IdleQueue extends ListQueue {
  constructor(paused, timeoutBatchInMs, options) {
    super(paused);
    this.timeoutBatch = timeoutBatchInMs;
    this.options = options;
  }

  startQueue() {
    const handle = requestIdleCallback(this.processTasks.bind(this), this.options);
    return () => void cancelIdleCallback(handle);
  }

  processTasks(deadline) {
    if (this.stopQueue) {
      this.stopQueue();
      this.stopQueue = null;
    }
    if (deadline.didTimeout) {
      this._drainBatch(this.timeoutBatch, {deadline});
    } else {
      while (deadline.timeRemaining() > 0 && !this.list.isEmpty) {
        const task = this.list.popFront();
        task.fn({deadline, task, queue: this});
      }
    }
    if (!this.list.isEmpty) this.stopQueue = this.startQueue();
  }
}

export const idleQueue = new IdleQueue();

export const defer = idleQueue.enqueue.bind(idleQueue);

export default idleQueue;

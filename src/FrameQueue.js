// @ts-self-types="./FrameQueue.d.ts"

'use strict';

import List from 'list-toolkit/list.js';
import ListQueue from './ListQueue.js';

export class FrameQueue extends ListQueue {
  constructor(paused, batchInMs) {
    super(paused);
    this.batch = batchInMs;
  }

  startQueue() {
    const handle = requestAnimationFrame(this.processTasks.bind(this));
    return () => void cancelAnimationFrame(handle);
  }

  processTasks(timeStamp) {
    if (this.stopQueue) {
      this.stopQueue();
      this.stopQueue = null;
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

    if (!this.list.isEmpty) this.stopQueue = this.startQueue();
  }
}

export const frameQueue = new FrameQueue();

export default frameQueue;

// @ts-self-types="./FrameQueue.d.ts"

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
    this._drainBatch(this.batch, {timeStamp});
    if (!this.list.isEmpty) this.stopQueue = this.startQueue();
  }
}

export const frameQueue = new FrameQueue();

export default frameQueue;

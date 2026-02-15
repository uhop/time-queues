// @ts-self-types="./ListQueue.d.ts"

'use strict';

import List from 'list-toolkit/list.js';
import MicroTaskQueue from './MicroTaskQueue.js';

/**
 * ListQueue extends MicroTaskQueue with linked-list task storage.
 * AI-NOTE: This is the concrete base class most specialized queues extend.
 * Key pattern: startQueue() returns a stop function (or null if not started).
 * @see IdleQueue, FrameQueue, LimitedQueue, Scheduler - All extend ListQueue
 */
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

  /**
   * Start processing the queue - MUST be overridden by subclasses.
   * AI-NOTE: This is the abstract method pattern - base returns null.
   * Subclasses return a function that stops the processing.
   * @returns {Function|null} Stop function or null if not started
   */
  startQueue() {
    return null;
  }
}

export default ListQueue;

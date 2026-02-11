// @ts-self-types="./LimitedQueue.d.ts"

import ListQueue from './ListQueue.js';

export class LimitedQueue extends ListQueue {
  #taskLimit;
  #activeTasks;
  #idleWaiters;

  constructor(limit, paused) {
    super(paused);
    this.#taskLimit = limit;
    this.#activeTasks = 0;
    this.#idleWaiters = [];
  }

  get taskLimit() {
    return this.#taskLimit;
  }

  set taskLimit(limit) {
    this.#taskLimit = Math.max(1, limit);
    this.#processTasks();
  }

  get activeTasks() {
    return this.#activeTasks;
  }

  get isIdle() {
    return !this.#activeTasks && this.list.isEmpty;
  }

  waitForIdle() {
    return new Promise(resolve => {
      if (this.isIdle) {
        resolve();
      } else {
        this.#idleWaiters.push(resolve);
      }
    });
  }

  startQueue() {
    this.#processTasks();
    return null;
  }

  #processTasks() {
    if (this.paused) return;
    if (this.isIdle) {
      const waiters = this.#idleWaiters;
      this.#idleWaiters = [];
      waiters.forEach(resolve => resolve());
      return;
    }
    while (this.#activeTasks < this.#taskLimit && !this.list.isEmpty) {
      const task = this.list.popFront();
      ++this.#activeTasks;
      LimitedQueue.wrap(() => task.fn({task, queue: this})).finally(() => {
        --this.#activeTasks;
        this.#processTasks();
      });
    }
  }

  static wrap(fn) {
    return new Promise((resolve, reject) => {
      try {
        resolve(fn());
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default LimitedQueue;

// @ts-self-types="./LimitedQueue.d.ts"

import ListQueue from './ListQueue.js';

export class LimitedQueue extends ListQueue {
  #taskLimit;
  #activeTasks;

  constructor(limit, paused) {
    super(paused);
    this.#taskLimit = limit;
    this.#activeTasks = 0;
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

  startQueue() {
    this.#processTasks();
    return null;
  }

  #processTasks() {
    if (this.#activeTasks >= this.#taskLimit || this.list.isEmpty || this.paused) return;
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

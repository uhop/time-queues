'use strict';

import MinHeap from 'list-toolkit/MinHeap.js';

export class Task {
  constructor(delay, fn) {
    this.delay = delay;
    this.fn = fn;
    this.time = Date.now() + delay;
  }
}

export class Scheduler {
  constructor(paused) {
    this.queue = new MinHeap({less: (a, b) => a.time < b.time});
    this.paused = Boolean(paused);
    this.handle = null;
  }

  get isEmpty() {
    return this.queue.isEmpty;
  }

  get nextTime() {
    return this.queue.isEmpty ? Infinity : this.queue.top.time;
  }

  pause() {
    this.paused = true;
    if (this.handle) {
      clearTimeout(this.handle);
      this.handle = null;
    }
    return this;
  }

  resume() {
    if (this.paused) {
      this.paused = false;
      this.processTasks();
    }
    return this;
  }

  enqueue(delay, fn) {
    const task = new Task(delay, fn);

    if (this.paused) {
      this.queue.push(task);
      return task;
    }

    const nextTime = this.nextTime;
    this.queue.push(task);
    if (nextTime > this.nextTime) {
      if (this.handle) clearTimeout(this.handle);
      this.handle = setTimeout(this.processTasks.bind(this), this.nextTime - Date.now());
    }

    return task;
  }

  dequeue(task) {
    // TODO: remove task from queue
    return this;
  }

  clear() {
    const paused = this.paused;
    if (!paused) this.pause();
    this.queue.clear();
    if (!paused) this.resume();
  }

  processTasks() {
    if (this.handle) {
      clearTimeout(this.handle);
      this.handle = null;
    }

    while (!this.queue.isEmpty && this.queue.top.time <= Date.now()) {
      const task = this.queue.pop();
      task.fn(task, this);
    }

    if (!this.queue.isEmpty) {
      this.handle = setTimeout(this.processTasks.bind(this), this.nextTime - Date.now());
    }
  }
}

export const scheduler = new Scheduler();

export default scheduler;

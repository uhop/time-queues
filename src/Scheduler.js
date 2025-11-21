// @ts-self-types="./Scheduler.d.ts"

'use strict';

import MinHeap from 'list-toolkit/heap.js';
import MicroTask from './MicroTask.js';
import MicroTaskQueue from './MicroTaskQueue.js';

export class Task extends MicroTask {
  constructor(delay, fn) {
    super(fn);
    if (delay instanceof Date) {
      this.time = delay.getTime();
      this.delay = this.time - Date.now();
    } else {
      this.time = Date.now() + delay;
      this.delay = delay;
    }
  }
}

export class Scheduler extends MicroTaskQueue {
  constructor(paused, tolerance = 4) {
    super(paused);
    this.queue = new MinHeap({less: (a, b) => a.time < b.time});
    this.tolerance = tolerance;
    this.stopQueue = null;
  }

  get isEmpty() {
    return this.queue.isEmpty;
  }

  get nextTime() {
    return this.queue.isEmpty ? Infinity : this.queue.top.time;
  }

  pause() {
    if (!this.paused) {
      this.paused = true;
      if (this.stopQueue) this.stopQueue = (this.stopQueue(), null);
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

  enqueue(fn, delay) {
    const task = new Task(delay, fn);

    if (this.paused) {
      this.queue.push(task);
      return task;
    }

    const nextTime = this.nextTime;
    this.queue.push(task);
    if (nextTime > this.nextTime) {
      if (this.stopQueue) this.stopQueue();
      this.stopQueue = this.startQueue();
    }

    return task;
  }

  dequeue(task) {
    task.cancel();
    if (this.queue.isEmpty) return this;
    if (this.paused || this.queue.top !== task) {
      this.queue.remove(task);
      return this;
    }

    // we are not paused and the task is the top => remove top and restart a timer if needed
    this.pause();
    this.queue.pop();
    this.resume();
    return this;
  }

  clear() {
    const paused = this.paused;
    if (!paused) this.pause();
    this.queue.array.forEach(task => task.cancel());
    this.queue.clear();
    if (!paused) this.resume();
  }

  startQueue() {
    const handle = setTimeout(
      this.processTasks.bind(this),
      Math.max(this.nextTime - Date.now(), 0)
    );
    return () => void clearTimeout(handle);
  }

  processTasks() {
    if (this.stopQueue) this.stopQueue = (this.stopQueue(), null);

    while (
      !this.queue.isEmpty &&
      !this.paused &&
      this.queue.top.time <= Date.now() + this.tolerance
    ) {
      const task = this.queue.pop();
      task.fn({task, scheduler: this});
    }

    if (!this.paused && !this.queue.isEmpty) this.stopQueue = this.startQueue();
  }
}

export const repeat = (fn, delay) => {
  const repeatableFunction = ({task, scheduler}) => {
    fn({task, scheduler});
    scheduler.enqueue(repeatableFunction, isNaN(delay) ? task.delay : delay);
  };
  return repeatableFunction;
};

export const scheduler = new Scheduler();

export default scheduler;

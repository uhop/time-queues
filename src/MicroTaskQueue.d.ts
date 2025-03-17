import {MicroTask} from './MicroTask';

/**
 * A queue of microtasks that will be executed when scheduled.
 * It is a base class for other task queues.
 */
export declare class MicroTaskQueue {
  /**
   * Whether the queue is paused.
   */
  paused: boolean;

  /**
   * Creates a new microtask queue.
   * @param paused Whether the queue should start paused.
   */
  constructor(paused: boolean);

  /**
   * Whether the queue is empty.
   * It is meant to be overridden in subclasses.
   */
  get isEmpty(): boolean;

  /**
   * Enqueues a microtask.
   * It is meant to be overridden in subclasses.
   * @param fn The function to execute when the microtask is scheduled.
   * @returns The enqueued microtask.
   */
  enqueue(fn: () => void): MicroTask;

  /**
   * Dequeues a microtask.
   * It is meant to be overridden in subclasses.
   * @param task The microtask to dequeue.
   * @returns The queue.
   */
  dequeue(task: MicroTask): this;

  /**
   * Clears the queue.
   * It is meant to be overridden in subclasses.
   * @returns The queue.
   */
  clear(): this;

  /**
   * Pauses the queue.
   * It is meant to be overridden in subclasses.
   * @returns The queue.
   */
  pause(): this;

  /**
   * Resumes the queue.
   * It is meant to be overridden in subclasses.
   * @returns The queue.
   */
  resume(): this;
}

export default MicroTaskQueue;

import {MicroTask} from './MicroTask';
import {MicroTaskQueue} from './MicroTaskQueue';
import {List} from 'list-toolkit';

/**
 * A list-based queue of microtasks that will be executed when scheduled.
 * It is a base class for other list-based task queues.
 */
export declare class ListQueue extends MicroTaskQueue {
  /**
   * Whether the queue is paused.
   */
  paused: boolean;

  /**
   * The function that stops the queue.
   * It is used internally by `pause()` and `resume()`.
   */
  stopQueue: (() => void) | null;

  /**
   * Creates a new list queue.
   * @param paused Whether the queue should start paused.
   */
  constructor(paused?: boolean);

  /**
   * Whether the queue is empty.
   */
  get isEmpty(): boolean;

  /**
   * Enqueues a microtask.
   * @param fn The function to execute when the microtask is scheduled.
   * @returns The enqueued microtask.
   */
  enqueue(fn: () => unknown): MicroTask;

  /**
   * Dequeues a microtask.
   * @param task The microtask to dequeue.
   * @returns The queue.
   */
  dequeue(task: MicroTask): this;

  /**
   * Schedules a microtask.
   * @param fn The function to execute. If `undefined` or `null`, the task's promise will be resolved with function's arguments. Otherwise, it is resolved with the function's return value.
   * @returns The task object.
   */
  schedule(fn: (() => unknown) | null | undefined): MicroTask;

  /**
   * Clears the queue.
   * @returns The queue.
   */
  clear(): this;

  /**
   * Pauses the queue.
   * @returns The queue.
   */
  pause(): this;

  /**
   * Resumes the queue.
   * @returns The queue.
   */
  resume(): this;

  /**
   * Starts the queue.
   * It is used internally by `resume()`.
   * It is meant to be overridden in subclasses.
   * @returns The function that stops the queue.
   */
  startQueue(): (() => void) | null;
}

/**
 * A task for list queues.
 */
export declare type Task = MicroTask;

export default ListQueue;

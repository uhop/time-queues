import {MicroTask} from './MicroTask';
import {List} from 'list-toolkit';

/**
 * A list-based queue of microtasks that will be executed when scheduled.
 * It is a base class for other list-based task queues.
 */
export declare class ListQueue extends MicroTaskQueue {
  /**
   * The list of tasks.
   */
  list: List<MicroTask>;

  /**
   * The function that stops the queue.
   * It is used internally by `pause()` and `resume()`.
   */
  stopQueue: (() => void) | null;

  /**
   * Creates a new list queue.
   * @param paused Whether the queue is starting paused.
   */
  constructor(paused: boolean);

  /**
   * Whether the queue is empty.
   */
  get isEmpty(): boolean;

  /**
   * Enqueues a microtask.
   * @param fn The function to execute when the microtask is scheduled.
   * @returns The enqueued microtask.
   */
  enqueue(fn: () => void): MicroTask;

  /**
   * Dequeues a microtask.
   * @param task The microtask to dequeue.
   * @returns The queue.
   */
  dequeue(task: MicroTask): ListQueue;

  /**
   * Clears the queue.
   * @returns The queue.
   */
  clear(): ListQueue;

  /**
   * Pauses the queue.
   * @returns The queue.
   */
  pause(): ListQueue;

  /**
   * Resumes the queue.
   * @returns The queue.
   */
  resume(): ListQueue;

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

import {ListQueue, Task} from './ListQueue';

export {Task};

export declare class LimitedQueue extends ListQueue {
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
   * @param limit The maximum number of tasks that can be run in parallel.
   * @param paused Whether the queue should start paused.
   */
  constructor(limit: number, paused?: boolean);

  /**
   * Whether the queue is empty.
   */
  get isEmpty(): boolean;

  /**
   * Get the maximum number of tasks that can be run in parallel.
   */
  get taskLimit(): number;

  /**
   * Set the maximum number of tasks that can be run in parallel.
   */
  set taskLimit(limit: number);

  get activeTasks(): number;

  /**
   * Enqueues a microtask.
   * @param fn The function to execute when the microtask is scheduled.
   * @returns The enqueued microtask.
   */
  enqueue(fn: () => unknown): Task;

  /**
   * Dequeues a microtask.
   * @param task The microtask to dequeue.
   * @returns The queue.
   */
  dequeue(task: Task): this;

  /**
   * Schedules a microtask.
   * @param fn The function to execute. If `undefined` or `null`, the task's promise will be resolved with function's arguments. Otherwise, it is resolved with the function's return value.
   * @returns The task object.
   */
  schedule(fn: (() => unknown) | null | undefined): Task;

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

export default LimitedQueue;

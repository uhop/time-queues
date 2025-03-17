import {ListQueue, Task} from './ListQueue';

/**
 * A queue based on [requestIdleCallback()](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback).
 * Used for background tasks.
 */
export declare class IdleQueue extends ListQueue {
  /**
   * The timeout batch size in milliseconds for running tasks.
   * If `undefined`, all tasks are run in a single idle period.
   * This timeout is used only when `deadline.didTimeout` passed by `requestIdleCallback()` is `true`.
   */
  timeoutBatch: number | undefined;

  /**
   * The options passed to `requestIdleCallback()`.
   */
  options: IdleCallbackOptions | undefined;

  /**
   * Creates a new idle queue.
   * @param paused Whether the queue is starting paused.
   * @param timeoutBatchInMs The timeout batch size in milliseconds.
   * @param options The options passed to `requestIdleCallback()`.
   */
  constructor(paused: boolean = false, timeoutBatchInMs?: number, options?: IdleCallbackOptions);

  /**
   * Enqueues a task.
   * @param fn The function to execute.
   * @returns The task object.
   */
  enqueue(fn: (deadline: IdleDeadline, task: Task, queue: IdleQueue) => void): Task;

  /**
   * Starts the queue.
   * It is used internally by `resume()`.
   * @returns The function that stops the queue.
   */
  startQueue(): (() => void) | null;
}

/**
 * The default idle queue usually used as a global queue.
 */
export const idleQueue: IdleQueue;

/**
 * A function that schedules a task to run in the next idle period.
 */
export const defer: (fn: (deadline: IdleDeadline, task: Task, queue: IdleQueue) => void) => Task;

export default IdleQueue;

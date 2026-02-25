import {ListQueue, Task} from './ListQueue';

/**
 * A queue based on [requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame).
 * Used in an animation loop or for drawing updates.
 */
export declare class FrameQueue extends ListQueue {
  /**
   * Whether the queue is paused.
   */
  paused: boolean;

  /**
   * The batch size in milliseconds for running tasks.
   * If `undefined`, all tasks are run in a single frame.
   */
  batch: number | undefined;

  /**
   * Creates a new frame queue.
   * @param paused Whether the queue should start paused.
   * @param batchInMs The batch size in milliseconds.
   */
  constructor(paused?: boolean, batchInMs?: number);

  /**
   * Whether the queue is empty.
   */
  get isEmpty(): boolean;

  /**
   * Enqueues a task.
   * @param fn The function to execute.
   * @returns The task object.
   */
  enqueue(fn: ({timeStamp: number, task: Task, queue: FrameQueue}) => unknown): Task;

  /**
   * Dequeues a task.
   * @param task The task to dequeue.
   * @returns The queue.
   */
  dequeue(task: Task): this;

  /**
   * Schedules a task to run in the next frame.
   * @param fn The function to execute. If `undefined` or `null`, the task's promise will be resolved with the function's arguments. Otherwise, it is resolved with the function's return value.
   * @returns The task object.
   */
  schedule(
    fn: (({timeStamp: number, task: Task, queue: FrameQueue}) => unknown) | null | undefined
  ): Task;

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
   * @returns The function that stops the queue.
   */
  startQueue(): (() => void) | null;
}

/**
 * The default frame queue usually used as a global queue.
 */
export const frameQueue: FrameQueue;

export default frameQueue;

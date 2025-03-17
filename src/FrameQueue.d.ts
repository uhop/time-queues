import {ListQueue, Task} from './ListQueue';

/**
 * A queue based on [requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame).
 * Used in an animation loop or for drawing updates.
 */
export declare class FrameQueue extends ListQueue {
  /**
   * The batch size in milliseconds for running tasks.
   * If `undefined`, all tasks are run in a single frame.
   */
  batch: number | undefined;

  /**
   * Creates a new frame queue.
   * @param paused Whether the queue is starting paused.
   * @param batchInMs The batch size in milliseconds.
   */
  constructor(paused: boolean = false, batchInMs?: number);

  /**
   * Enqueues a task.
   * @param fn The function to execute.
   * @returns The task object.
   */
  enqueue(fn: (timeStamp: number, task: Task, queue: FrameQueue) => void): Task;

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

export default FrameQueue;

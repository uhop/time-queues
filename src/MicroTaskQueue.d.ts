import MicroTask from './MicroTask';

/**
 * A queue of microtasks that will be executed when scheduled.
 * It serves as a base class for other task queues.
 */
export declare class MicroTaskQueue {
  /**
   * Whether the queue is currently paused.
   * When paused, new tasks are queued but not executed immediately.
   */
  paused: boolean;

  /**
   * Creates a new microtask queue.
   * @param paused Whether the queue should start in a paused state.
   */
  constructor(paused?: boolean);

  /**
   * Whether the queue is empty.
   * This property should be overridden in subclasses to provide actual implementation.
   */
  get isEmpty(): boolean;

  /**
   * Enqueues a microtask for execution.
   * This method should be overridden in subclasses to provide actual implementation.
   * @param fn The function to execute when the microtask is scheduled.
   * @returns The enqueued microtask.
   */
  enqueue(fn: () => unknown): MicroTask;

  /**
   * Dequeues a microtask from the queue.
   * This method should be overridden in subclasses to provide actual implementation.
   * @param task The microtask to dequeue.
   * @returns The queue instance for chaining.
   */
  dequeue(task: MicroTask): this;

  /**
   * Schedules a microtask with a promise for execution.
   * This can be overridden in subclasses if more arguments are needed.
   * @param fn The function to execute when the microtask is scheduled, it can be an async function.
   * @returns The scheduled microtask.
   */
  schedule(fn: (() => unknown) | null | undefined): MicroTask;

  /**
   * Clears all tasks from the queue.
   * This method should be overridden in subclasses to provide actual implementation.
   * @returns The queue instance for chaining.
   */
  clear(): this;

  /**
   * Pauses the queue.
   * When paused, new tasks are queued but not executed immediately.
   * This method should be overridden in subclasses to provide actual implementation.
   * @returns The queue instance for chaining.
   */
  pause(): this;

  /**
   * Resumes the queue.
   * When resumed, queued tasks will be executed according to their scheduling.
   * This method should be overridden in subclasses to provide actual implementation.
   * @returns The queue instance for chaining.
   */
  resume(): this;
}

export default MicroTaskQueue;

import MicroTask from './MicroTask';
import MicroTaskQueue from './MicroTaskQueue';

/**
 * A task that will be executed at a later time by `Scheduler`.
 */
export declare class Task extends MicroTask {
  /**
   * The function to execute.
   */
  fn: ({task: Task, scheduler: Scheduler}) => unknown;

  /**
   * Whether the task has been canceled.
   */
  isCanceled: boolean;

  /**
   * The time in milliseconds (Unix timestamp) when the task is scheduled to run.
   */
  time: number;

  /**
   * The delay in milliseconds before the task is executed.
   */
  delay: number;

  /**
   * Creates a new task.
   * @param delay The delay before the task is executed. It can be a number of milliseconds or a `Date` object as an absolute time.
   * @param fn The function to execute.
   */
  constructor(delay: number | Date, fn: ({task: Task, scheduler: Scheduler}) => unknown);

  /**
   * Makes a promise that will be resolved when the microtask is executed.
   * @returns The microtask.
   */
  makePromise(): this;

  /**
   * The promise that could be resolved when the microtask is executed.
   * This is a queue-specific promise. It may be created when there is an associated asynchronous task.
   * If the microtask is canceled, the promise will be rejected with a CancelTaskError.
   */
  get promise(): Promise<unknown> | null;

  /**
   * Resolves the microtask, if a promise is created.
   * @param value The value to resolve the microtask with.
   * @returns The microtask.
   */
  resolve(value: unknown): this;

  /**
   * Cancels the microtask, if a promise is created.
   * If the microtask is canceled, the promise will be rejected with a CancelTaskError.
   * @returns The microtask.
   */
  cancel(): this;
}

/**
 * A scheduler that manages tasks to be executed at a later time.
 */
export declare class Scheduler extends MicroTaskQueue {
  /**
   * Whether the scheduler is paused.
   * When paused, new tasks are queued but not executed immediately.
   */
  paused: boolean;

  /**
   * The tolerance for comparing starting time of tasks.
   * This allows for small timing differences in task execution.
   */
  tolerance: number;

  /**
   * Creates a new scheduler.
   * @param paused Whether the scheduler should start in a paused state.
   * @param tolerance The tolerance for comparing starting time of tasks (default is 4ms).
   */
  constructor(paused?: boolean, tolerance?: number);

  /**
   * Whether the scheduler is empty.
   * Returns true if there are no tasks scheduled for execution.
   */
  get isEmpty(): boolean;

  /**
   * The next scheduled time or `Infinity` if the scheduler is empty.
   * Represents the time when the next task is scheduled to execute.
   */
  get nextTime(): number;

  /**
   * Enqueues a task for future execution.
   * @param fn The function to execute.
   * @param delay The delay before the task is executed. It can be a number of milliseconds or a `Date` object as an absolute time.
   * @returns The task object that was enqueued.
   */
  enqueue(fn: ({task: Task, scheduler: Scheduler}) => unknown, delay: number | Date): Task;

  /**
   * Removes a task from the scheduler.
   * @param task The task to remove.
   * @returns The scheduler object for chaining.
   */
  dequeue(task: Task): this;

  /**
   * Schedules a task to run in the future.
   * @param fn The function to execute. If `undefined` or `null`, the task's promise will be resolved with function's arguments. Otherwise, it is resolved with the function's return value.
   * @param delay The delay before the task is executed. It can be a number of milliseconds or a `Date` object as an absolute time.
   * @returns The task object that was scheduled.
   */
  schedule(
    fn: (({task: Task, scheduler: Scheduler}) => unknown) | null | undefined,
    delay: number | Date
  ): Task;

  /**
   * Clears all tasks from the scheduler.
   * @returns The scheduler instance for chaining.
   */
  clear(): this;

  /**
   * Pauses the scheduler.
   * When paused, new tasks are queued but not executed immediately.
   * @returns The scheduler instance for chaining.
   */
  pause(): this;

  /**
   * Resumes the scheduler.
   * When resumed, queued tasks will be executed according to their scheduling.
   * @returns The scheduler instance for chaining.
   */
  resume(): this;
}

/**
 * Creates a repeatable task.
 * @param fn The function to execute.
 * @param delay The delay before the task is executed. It can be a number of milliseconds or a `Date` object as an absolute time.
 * @returns A function that can be used to enqueue the task to the scheduler.
 */
export declare const repeat: (
  fn: ({task: Task, scheduler: Scheduler}) => void,
  delay: number | Date
) => ({task: Task, scheduler: Scheduler}) => void;

/**
 * A scheduler instance usually used as a global scheduler.
 */
export declare const scheduler: Scheduler;

export default scheduler;

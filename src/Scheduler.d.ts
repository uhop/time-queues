import MinHeap from 'list-toolkit/heap.js';
import MicroTask from './MicroTask.js';
import MicroTaskQueue from './MicroTaskQueue.js';

/**
 * A task that will be executed at a later time by `Scheduler`.
 * Inherits `makePromise()`, `promise`, `settled`, `cancelError`, `resolve()`,
 * and `cancel()` from `MicroTask` — see `MicroTask.d.ts` for their contracts.
 */
export declare class Task extends MicroTask {
  /**
   * The function to execute. Narrower signature than `MicroTask.fn`.
   */
  fn: (arg: {task: Task; scheduler: Scheduler}) => unknown;

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
  constructor(delay: number | Date, fn: (arg: {task: Task; scheduler: Scheduler}) => unknown);
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
   * The min-heap of pending tasks ordered by `time`.
   */
  queue: MinHeap<Task>;

  /**
   * The function that stops the scheduler loop.
   * It is used internally by `pause()` and `resume()`.
   */
  stopQueue: (() => void) | null;

  /**
   * Optional handler invoked when a scheduled `task.fn` throws.
   * If unset, exceptions are surfaced via `Promise.reject(error)` so they
   * fire the standard unhandled-rejection channel; the scheduler loop
   * always continues regardless.
   */
  onError: ((error: unknown, task: Task) => void) | null;

  /**
   * The tolerance for comparing starting times of tasks.
   * This allows for small timing differences in task execution.
   */
  tolerance: number;

  /**
   * Creates a new scheduler.
   * @param paused Whether the scheduler should start in a paused state.
   * @param tolerance The tolerance for comparing starting times of tasks (default is 4ms).
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
  enqueue(fn: (arg: {task: Task; scheduler: Scheduler}) => unknown, delay: number | Date): Task;

  /**
   * Removes a task from the scheduler.
   * @param task The task to remove.
   * @returns The scheduler object for chaining.
   */
  dequeue(task: MicroTask): this;

  /**
   * Schedules a task to run in the future.
   * @param fn The function to execute. If `undefined` or `null`, the task's promise will be resolved with the function's arguments. Otherwise, it is resolved with the function's return value.
   * @param delay The delay before the task is executed. It can be a number of milliseconds or a `Date` object as an absolute time.
   * @returns The task object that was scheduled.
   */
  schedule(
    fn: ((arg: {task: Task; scheduler: Scheduler}) => unknown) | null | undefined,
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

  /**
   * Starts the scheduler loop by arming a `setTimeout` for the next-due task.
   * Used internally by `enqueue()` and `resume()`.
   * @returns The function that stops the scheduler loop.
   */
  startQueue(): (() => void) | null;

  /**
   * Processes due tasks. Called by the scheduler's internal `setTimeout`
   * timer — not part of the typical user surface.
   */
  processTasks(): void;
}

/**
 * Creates a repeatable task.
 * @param fn The function to execute.
 * @param delay The delay before the task is executed. It can be a number of milliseconds or a `Date` object as an absolute time.
 * @returns A function that can be used to enqueue the task to the scheduler.
 */
export declare const repeat: (
  fn: (arg: {task: Task; scheduler: Scheduler}) => void,
  delay: number | Date
) => (arg: {task: Task; scheduler: Scheduler}) => void;

/**
 * A scheduler instance usually used as a global scheduler.
 */
export declare const scheduler: Scheduler;

export default scheduler;

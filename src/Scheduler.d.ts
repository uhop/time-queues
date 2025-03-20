import MicroTask from './MicroTask';
import MicroTaskQueue from './MicroTaskQueue';

/**
 * A task that will be executed at a later time by `Scheduler`.
 */
export declare class Task extends MicroTask {
  /**
   * The function to execute.
   */
  fn: (task: Task, scheduler: Scheduler) => void;

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
  constructor(delay: number | Date, fn: (task: Task, scheduler: Scheduler) => void);
}

/**
 * A scheduler that manages tasks to be executed at a later time.
 */
export declare class Scheduler extends MicroTaskQueue {
  /**
   * Whether the scheduler is paused.
   */
  paused: boolean;

  /**
   * The tolerance for comparing starting time of tasks.
   */
  tolerance: number;

  /**
   * Creates a new scheduler.
   * @param paused Whether the scheduler should start paused.
   * @param tolerance The tolerance for comparing starting time of tasks.
   */
  constructor(paused?: boolean, tolerance: number = 4);

  /**
   * Whether the scheduler is empty.
   */
  get isEmpty(): boolean;

  /**
   * The next scheduled time or `Infinity` if the scheduler is empty.
   */
  get nextTime(): number;

  /**
   * Enqueues a task.
   * @param fn The function to execute.
   * @param delay The delay before the task is executed. It can be a number of milliseconds or a `Date` object as an absolute time.
   * @returns The task object.
   */
  enqueue(fn: (task: Task, scheduler: Scheduler) => void, delay: number | Date): Task;

  /**
   * Removes a task from the scheduler.
   * @param task The task to remove.
   * @returns The scheduler object.
   */
  dequeue(task: Task): this;

  /**
   * Creates a promise that resolves after a delay.
   * @param delay The delay before the task is executed. It can be a number of milliseconds or a `Date` object as an absolute time.
   * @returns A promise that resolves after the delay.
   */
  schedule(delay: number | Date): Promise<{task: Task; scheduler: Scheduler}>;

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
}

/**
 * Creates a repeatable task.
 * @param fn The function to execute.
 * @param delay The delay before the task is executed. It can be a number of milliseconds or a `Date` object as an absolute time.
 * @returns A function that can be used to enqueue the task to the scheduler.
 */
export declare const repeat: (
  fn: (task: Task, scheduler: Scheduler) => void,
  delay: number | Date
) => (task: Task, scheduler: Scheduler) => void;

/**
 * A scheduler instance usually used as a global scheduler.
 */
export declare const scheduler: Scheduler;

export default scheduler;

import MicroTask from './MicroTask';
import MicroTaskQueue from './MicroTaskQueue';

/**
 * A task that will be executed at a later time by `Scheduler`.
 */
export declare class Task extends MicroTask {
  /**
   * Creates a new task.
   * @param delay The delay before the task is executed. It can be a number of milliseconds or a `Date` object as an absolute time.
   * @param fn The function to execute.
   */
  constructor(delay: number | Date, fn: () => void);
}

/**
 * A scheduler that manages tasks to be executed at a later time.
 */
export declare class Scheduler extends MicroTaskQueue {
  /**
   * Creates a new scheduler.
   * @param paused Whether the scheduler should start paused.
   * @param tolerance The tolerance for comparing starting time of tasks.
   */
  constructor(paused: boolean, tolerance: number = 4);

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

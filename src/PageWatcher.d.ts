import {ListQueue, Task} from './ListQueue';

/**
 * A page state.
 */
export declare type PageState = 'active' | 'passive' | 'hidden' | 'frozen' | 'terminated';

/**
 * A queue that monitors the page's lifecycle.
 */
export declare class PageWatcher extends ListQueue {
  /**
   * Whether the queue is paused.
   */
  paused: boolean;

  /**
   * The current state of the page.
   */
  currentState: PageState;

  /**
   * Creates a new page watcher.
   * @param started Whether the queue is unpaused initially.
   */
  constructor(started?: boolean);

  /**
   * Whether the queue is empty.
   */
  get isEmpty(): boolean;

  /**
   * Enqueues a task.
   * @param fn The function to execute.
   * @param initialize Whether the function should be called immediately with the current state.
   * @returns The task object.
   */
  enqueue(
    fn: (state: PageState, previousState: PageState, task: Task, queue: ListQueue) => void,
    initialize?: boolean
  ): Task;

  /**
   * Dequeues a task.
   * @param task The task to dequeue.
   * @returns The queue.
   */
  dequeue(task: Task): this;

  /**
   * Schedules a task to be executed when the page state changes.
   * @throws Always throws an error.
   */
  schedule(): never;

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
 * A function that pauses or resumes a queue based on the page's state.
 * Its result can be used as a callback for `PageWatcher`.
 * @param queue The queue to pause or resume.
 * @param resumeStatesList The list of states that should resume the queue.
 * @returns A function that can be called with the current page state.
 */
export declare const watchStates: (
  queue: ListQueue,
  resumeStatesList: PageState[] = ['active']
) => (state: PageState) => void;

/**
 * The default page watcher usually used as a global queue.
 */
export declare const pageWatcher: PageWatcher;

export default pageWatcher;

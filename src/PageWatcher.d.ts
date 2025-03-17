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
   * The current state of the page.
   */
  currentState: PageState;

  /**
   * Creates a new page watcher.
   * @param started Whether the queue is unpaused initially.
   */
  constructor(started: boolean = false);

  /**
   * Enqueues a task.
   * @param fn The function to execute.
   * @param initialize Whether the function should be executed before the state changes.
   * @returns The task object.
   */
  enqueue(
    fn: (state: PageState, previousState: PageState, task: Task, queue: ListQueue) => void,
    initialize?: boolean
  ): Task;
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

export default PageWatcher;

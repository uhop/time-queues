/**
 * A microtask that will be executed when scheduled.
 */
export declare class MicroTask {
  /**
   * The function to execute when the microtask is scheduled.
   */
  fn: () => void;

  /**
   * Creates a new microtask.
   * @param fn The function to execute when the microtask is scheduled.
   */
  constructor(fn: () => void);
}

export default MicroTask;

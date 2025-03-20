/**
 * The options for a retainer.
 */
export declare interface RetainerOptions<T = unknown> {
  /**
   * The function to create a value.
   */
  create: () => Promise<T> | T;
  /**
   * The function to destroy a value.
   */
  destroy: (value: T) => Promise<void> | void;
  /**
   * The retention period in milliseconds.
   */
  retentionPeriod: number;
}

/**
 * Retains a value for a specified time.
 */
export declare class Retainer<T = unknown> implements RetainerOptions<T> {
  /**
   * The counter for the number of active references.
   */
  counter: number;

  /**
   * The value currently retained.
   */
  value: T | null;

  /**
   * The function to create a value.
   */
  create: () => Promise<T> | T;

  /**
   * The function to destroy a value.
   */
  destroy: (value: T) => Promise<void> | void;

  /**
   * The retention period in milliseconds.
   */
  retentionPeriod: number;

  /**
   * Creates a new retainer.
   * @param options The options for the retainer.
   */
  constructor(options: RetainerOptions<T>);

  /**
   * Retrieves the retained value.
   * @returns The retained value as a promise.
   */
  async get(): Promise<T>;

  /**
   * Releases the retained value.
   * @param immediately Whether to release the value immediately. Otherwise it'll be retained for the retention period.
   * @returns The retainer object.
   */
  async release(immediately?: boolean): Promise<this>;
}

export default Retainer;

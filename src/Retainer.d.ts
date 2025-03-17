/**
 * The options for a retainer.
 */
export declare interface RetainerOptions {
  /**
   * The function to create a value.
   */
  create: () => Promise<unknown>;
  /**
   * The function to destroy a value.
   */
  destroy: (value: unknown) => Promise<void>;
  /**
   * The retention period in milliseconds.
   */
  retentionPeriod: number;
}

/**
 * Retains a value for a specified time.
 */
export declare class Retainer implements RetainerOptions {
  /**
   * Creates a new retainer.
   * @param options The options for the retainer.
   */
  constructor(options: RetainerOptions);

  /**
   * Retrieves the retained value.
   * @returns The retained value as a promise.
   */
  async get(): Promise<unknown>;

  /**
   * Releases the retained value.
   * @param immediately Whether to release the value immediately. Otherwise it'll be retained for the retention period.
   * @returns The retainer object.
   */
  async release(immediately?: boolean): Promise<this>;
}

export default Retainer;

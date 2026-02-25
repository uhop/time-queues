/**
 * Runs asynchronous operations in parallel, no more than a specified number at a time.
 * It takes an array of functions, which return promises when invoked without arguments.
 * All other non-function values are passed as-is and promises are resolved.
 * Modeled after Promise.all().
 *
 * @param fns An array of parameterless functions (asynchronous or not), promises, or values
 * @param limit How many asynchronous operations to run in parallel (default is 4)
 * @returns A promise that resolves when all functions have completed to an array of results
 */
export declare function batch(
  fns: ((() => PromiseLike<unknown>) | PromiseLike<unknown> | unknown)[],
  limit?: number
): Promise<unknown[]>;

export default batch;

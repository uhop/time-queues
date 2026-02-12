/**
 * Random sleep function modelled after `sleep()`.
 */
export type RandomSleepFunction = () => Promise<void>;

/**
 * Creates a random sleep function that uses a uniform distribution.
 * @param min The minimum delay in milliseconds.
 * @param max The maximum delay in milliseconds.
 * @returns A random sleep function.
 */
export declare function randomUniformSleep(min: number, max: number): RandomSleepFunction;

/**
 * Creates a random sleep function that uses a normal distribution.
 * @param mean The mean delay in milliseconds.
 * @param stdDev The standard deviation of the delay in milliseconds.
 * @param skewness The skewness of the delay distribution.
 * @returns A random sleep function.
 */
export declare function randomNormalSleep(
  mean: number,
  stdDev: number,
  skewness: number = 0
): RandomSleepFunction;

/**
 * Creates a random sleep function that uses an exponential distribution.
 * @param min The minimum delay in milliseconds.
 * @param max The maximum delay in milliseconds.
 * @param lambda The rate parameter of the exponential distribution (how many times per `max - min` an event occurs).
 * @returns A random sleep function.
 */
export declare function randomExpoSleep(
  min: number,
  max: number,
  lambda: number
): RandomSleepFunction;

/**
 * Creates a random sleep function that uses a Pareto distribution.
 * @param min The minimum delay in milliseconds.
 * @param alpha The shape parameter of the Pareto distribution.
 * @returns A random sleep function.
 */
export declare function randomParetoSleep(min: number, alpha: number): RandomSleepFunction;

/**
 * A simple sleep function that uses a uniform distribution.
 * @param max The maximum delay in milliseconds.
 * @param min The minimum delay in milliseconds.
 * @returns A promise that resolves after the delay.
 */
export declare function randomSleep(max: number, min: number = 0): Promise<void>;

export default randomSleep;

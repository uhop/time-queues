/**
 * Random sleep function modeled after `sleep()`.
 */
export type RandomSleepFunction = () => Promise<void>;

/**
 * Creates a random sleep function that uses a uniform distribution.
 * @param min The minimum delay in milliseconds.
 * @param max The maximum delay in milliseconds.
 * @returns A sleep function.
 */
export declare function randomUniformSleep(min: number, max: number): RandomSleepFunction;

/**
 * Creates a random sleep function that uses a normal distribution.
 * @param mean The mean delay in milliseconds.
 * @param stdDev The standard deviation of the delay in milliseconds.
 * @param skewness The skewness of the delay distribution.
 * @returns A sleep function.
 */
export declare function randomNormalSleep(
  mean: number,
  stdDev: number,
  skewness: number = 0
): RandomSleepFunction;

/**
 * Creates a random sleep function that uses an exponential distribution.
 * @param rate The rate parameter of the exponential distribution (how many times per `range` an event occurs).
 * @param range The range of the exponential distribution.
 * @param base The base of the exponential distribution.
 * @returns A sleep function.
 */
export declare function randomExpoSleep(
  rate: number,
  range: number,
  base: number = 0
): RandomSleepFunction;

/**
 * Creates a random sleep function that uses a Pareto distribution.
 * @param min The minimum delay in milliseconds.
 * @param ratio The ratio of the Pareto distribution, e.g., 0.8 for the 80/20 Pareto rule. Should be a value between 0.5 and 1.
 * @returns A sleep function.
 * @throws Error if the ratio is not between 0.5 and 1.
 */
export declare function randomParetoSleep(min: number, ratio: number = 0.8): RandomSleepFunction;

/**
 * A simple sleep function that uses a uniform distribution.
 * @param max The maximum delay in milliseconds.
 * @param min The minimum delay in milliseconds.
 * @returns A promise that resolves after the delay.
 */
export declare function randomSleep(max: number, min: number = 0): Promise<void>;

export default randomSleep;

/**
 * Generate a random number from a uniform distribution.
 * @param min The minimum value of the distribution.
 * @param max The maximum value of the distribution.
 * @returns A random number from the uniform distribution.
 */
export declare function uniform(min: number, max: number): number;

/**
 * Generate a random number from a normal distribution.
 * @param mean The mean of the distribution.
 * @param stdDev The standard deviation of the distribution.
 * @param skewness The skewness of the distribution.
 * @returns A random number from the normal distribution.
 */
export declare function normal(mean: number, stdDev: number, skewness: number = 0): number;

/**
 * Generate a random number from an exponential distribution.
 * @param lambda The rate parameter of the distribution.
 * @returns A random number from the exponential distribution.
 */
export declare function expo(lambda: number): number;

/**
 * Generate a random number from a Pareto distribution.
 * @param min The minimum value of the distribution.
 * @param alpha The shape parameter of the distribution.
 * @returns A random number from the Pareto distribution.
 */
export declare function pareto(min: number, alpha: number): number;

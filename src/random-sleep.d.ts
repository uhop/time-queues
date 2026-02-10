import {uniform, normal, expo, pareto} from './randomDist';

type RandomSleepFunction = () => Promise<void>;

export declare function randomUniformSleep(min: number, max: number): RandomSleepFunction;

export declare function randomNormalSleep(
  mean: number,
  stdDev: number,
  skewness: number = 0
): RandomSleepFunction;

export declare function randomExpoSleep(lambda: number): RandomSleepFunction;

export declare function randomParetoSleep(min: number, alpha: number): RandomSleepFunction;

export declare function randomSleep(max: number, min: number = 0): Promise<void>;

export default randomSleep;

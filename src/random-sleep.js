// @ts-self-types="./random-sleep.d.ts"

import sleep from './sleep.js';
import {uniform, normal, expo, pareto} from './random-dist.js';

export const randomUniformSleep = (min, max) => () => sleep(uniform(min, max));

export const randomNormalSleep =
  (mean, stdDev, skewness = 0) =>
  () =>
    sleep(normal(mean, stdDev, skewness));

export const randomExpoSleep = lambda => () => sleep(expo(lambda));

export const randomParetoSleep = (min, alpha) => () => sleep(pareto(min, alpha));

export const randomSleep = (max, min = 0) => sleep(uniform(min, max));

export default randomSleep;

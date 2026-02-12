// @ts-self-types="./random-sleep.d.ts"

import sleep from './sleep.js';
import {uniform, normal, expo, pareto} from './random-dist.js';

export const randomUniformSleep = (min, max) => () => sleep(uniform(min, max));

export const randomNormalSleep =
  (mean, stdDev, skewness = 0) =>
  () =>
    sleep(normal(mean, stdDev, skewness));

export const randomExpoSleep =
  (rate, range, base = 0) =>
  () =>
    sleep(range * expo(rate) + base);

export const randomParetoSleep = (min, ratio = 0.8) => {
  if (ratio <= 0.5 || ratio >= 1 || isNaN(ratio))
    throw new Error('ratio must be greater than 0.5 and less than 1');
  const alpha = 1 / (1 - Math.log(ratio) / Math.log(1 - ratio));
  return () => sleep(pareto(min, alpha));
};

export const randomSleep = (max, min = 0) => sleep(uniform(min, max));

export default randomSleep;

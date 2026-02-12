// @ts-self-types="./random-dist.d.ts"

export const uniform = (min, max) => {
  const range = Math.abs(max - min);
  return Math.random() * range + Math.min(min, max);
};

export const normal = (mean, stdDev, skewness = 0) => {
  let u = 0,
    v = 0;
  while (!u) u = Math.random(); // Converting [0,1) to (0,1)
  while (!v) v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  if (!skewness) return z * stdDev + mean;
  const delta = skewness / Math.sqrt(1 + skewness * skewness),
    x = delta * z + Math.sqrt(1 - delta * delta) * v;
  z = z >= 0 ? x : -x;
  return z * stdDev + mean;
};

export const expo = lambda => {
  return -Math.log(1 - Math.random()) / lambda;
};

export const pareto = (min, alpha) => {
  return min / Math.pow(1 - Math.random(), 1 / alpha);
};

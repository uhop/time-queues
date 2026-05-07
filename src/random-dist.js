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
  const r = Math.sqrt(-2.0 * Math.log(u)),
    theta = 2.0 * Math.PI * v,
    z1 = r * Math.cos(theta);
  if (!skewness) return z1 * stdDev + mean;
  // Box-Muller yields two independent N(0,1) samples per (u, v) pair; use both for skew-normal.
  const z2 = r * Math.sin(theta),
    delta = skewness / Math.sqrt(1 + skewness * skewness),
    x = delta * z1 + Math.sqrt(1 - delta * delta) * z2;
  return (z1 >= 0 ? x : -x) * stdDev + mean;
};

export const expo = lambda => {
  return -Math.log(1 - Math.random()) / lambda;
};

export const pareto = (min, alpha) => {
  return min / Math.pow(1 - Math.random(), 1 / alpha);
};

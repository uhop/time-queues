// @ts-self-types="./sleep.d.ts"

export const sleep = ms => {
  if (ms instanceof Date) {
    ms = ms.getTime() - Date.now();
  }
  ms = Math.max(0, ms);
  return new Promise(resolve => setTimeout(resolve, ms));
};

export default sleep;

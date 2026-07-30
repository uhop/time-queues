// @ts-self-types="./wait-for.d.ts"

export const waitFor = (predicate, options = {}) => {
  const {timeout, interval = 50, signal} = options;
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    let done = false,
      timer = null,
      timeoutTimer = null;
    const settle = (fn, value) => {
      done = true;
      clearTimeout(timer);
      clearTimeout(timeoutTimer);
      signal?.removeEventListener('abort', onAbort);
      fn(value);
    };
    const onAbort = () => settle(reject, signal.reason);
    signal?.addEventListener('abort', onAbort);
    if (timeout !== undefined)
      timeoutTimer = setTimeout(() => settle(reject, new Error('waitFor: timed out')), timeout);
    const check = async () => {
      try {
        const value = await predicate();
        if (done) return;
        if (value) {
          settle(resolve, value);
          return;
        }
      } catch (error) {
        if (!done) settle(reject, error);
        return;
      }
      timer = setTimeout(check, interval);
    };
    check();
  });
};

export default waitFor;

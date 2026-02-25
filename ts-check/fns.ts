import audit from '../src/audit.js';
import throttle from '../src/throttle.js';
import sample from '../src/sample.js';
import debounce from '../src/debounce.js';
import sleep from '../src/sleep.js';
import whenDomLoaded from '../src/when-dom-loaded.js';
import whenLoaded from '../src/when-loaded.js';

const main = async () => {
  // audit
  {
    const fn = (x: number) => {};
    const auditedFn = audit(fn, 20);

    auditedFn(1);
    auditedFn(2);
  }

  // throttle
  {
    const fn = (x: number) => {};
    const throttledFn = throttle(fn, 20);

    throttledFn(1);
    throttledFn(2);
  }

  // sample
  {
    const fn = (x: number) => {};
    const sampledFn = sample(fn, 20);

    sampledFn(1);
    sampledFn(2);
  }

  // debounce
  {
    const fn = (x: number) => {};
    const debouncedFn = debounce(fn, 20);

    debouncedFn(1);
    debouncedFn(2);
  }

  // sleep
  {
    await sleep(20);
    await sleep(new Date(Date.now() + 20));
  }

  // whenDomLoaded
  {
    const fn = () => {};
    whenDomLoaded(fn);
  }

  // whenLoaded
  {
    const fn = () => {};
    whenLoaded(fn);
  }
};

main();

// @ts-self-types="./Counter.d.ts"

export class Counter {
  constructor(initial = 0) {
    this.count = initial;
    this.zeroWaiters = [];
    this.functionWaiters = new Set();
  }

  get value() {
    return this.count;
  }

  set value(value) {
    this.count = value;
    this.notify();
  }

  increment() {
    ++this.count;
    this.notify();
  }

  decrement() {
    --this.count;
    this.notify();
  }

  advance(amount = 1) {
    this.count += amount;
    this.notify();
  }

  waitForZero() {
    if (this.count === 0) return Promise.resolve(0);
    return new Promise(resolve => this.zeroWaiters.push(resolve));
  }

  waitFor(fn) {
    if (fn(this.count)) return Promise.resolve(this.count);
    return new Promise(resolve => this.functionWaiters.add({fn, resolve}));
  }

  clearWaiters() {
    if (this.zeroWaiters.length > 0) {
      const zeroWaiters = this.zeroWaiters;
      this.zeroWaiters = [];
      for (const resolve of zeroWaiters) {
        resolve(NaN);
      }
    }
    if (this.functionWaiters.size > 0) {
      const functionWaiters = this.functionWaiters;
      this.functionWaiters = new Set();
      for (const {resolve} of functionWaiters) {
        resolve(NaN);
      }
    }
  }

  notify() {
    if (this.count === 0 && this.zeroWaiters.length > 0) {
      const zeroWaiters = this.zeroWaiters;
      this.zeroWaiters = [];
      for (const resolve of zeroWaiters) {
        resolve(0);
      }
    }
    if (this.functionWaiters.size > 0) {
      const ready = [];
      for (const waiter of this.functionWaiters) {
        if (waiter.fn(this.count)) ready.push(waiter);
      }
      if (ready.length > 0) {
        for (const waiter of ready) {
          waiter.resolve(this.count);
          this.functionWaiters.delete(waiter);
        }
      }
    }
  }
}

export default Counter;

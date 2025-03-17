// @ts-self-types="./Throttler.d.ts"

'use strict';

import sleep from './sleep.js';

export class Throttler {
  constructor({
    throttlingTimeout = 1_000,
    neverSeenTimeout = 0,
    vacuumPeriod = throttlingTimeout * 3
  } = {}) {
    this.throttlingTimeout = throttlingTimeout;
    this.neverSeenTimeout = neverSeenTimeout;
    this.vacuumPeriod = vacuumPeriod;
    this.lastSeen = new Map();
    this.handle = null;
    if (this.vacuumPeriod) this.startVacuum();
  }

  getLastSeen(key) {
    return this.lastSeen.get(key) ?? 0;
  }

  getDelay(key) {
    const now = Date.now();
    let lastSeen = now,
      delay = this.neverSeenTimeout;
    if (this.lastSeen.has(key)) {
      lastSeen = this.lastSeen.get(key);
      delay = Math.max(0, this.throttlingTimeout - (now - lastSeen));
    }
    this.lastSeen.set(key, lastSeen + delay);
    return delay;
  }

  async wait(key) {
    const delay = this.getDelay(key);
    if (delay > 0) await sleep(delay);
  }

  vacuum() {
    const now = Date.now();
    for (const [key, lastSeen] of this.lastSeen) {
      if (now - lastSeen > this.throttlingTimeout) {
        this.lastSeen.delete(key);
      }
    }
  }

  startVacuum() {
    if (this.handle) return this;
    this.handle = setInterval(() => {
      this.vacuum();
    }, this.vacuumPeriod);
    return this;
  }

  stopVacuum() {
    if (!this.handle) return this;
    clearInterval(this.handle);
    this.handle = null;
    return this;
  }
}

export default Throttler;

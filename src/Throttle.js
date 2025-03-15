'use strict';

import sleep from './sleep.js';

export class Throttle {
  constructor({
    throttlingPeriod = 1_000,
    neverSeenPeriod = 0,
    vacuumPeriod = throttlingPeriod * 3,
    startVacuuming = true
  }) {
    this.throttlingPeriod = throttlingPeriod;
    this.neverSeenPeriod = neverSeenPeriod;
    this.vacuumPeriod = vacuumPeriod;
    this.lastSeen = new Map();
    this.handle = null;
    if (startVacuuming) this.startVacuum();
  }

  getDelay(key) {
    if (!this.lastSeen.has(key)) return this.neverSeenPeriod;
    const lastSeen = this.lastSeen.get(key), now = Date.now();
    this.lastSeen.set(key, now);
    return Math.max(0, this.throttlingPeriod - (now - lastSeen));
  }

  async wait(key) {
    const delay = this.getDelay(key);
    if (delay > 0) await sleep(delay);
  }

  vacuum() {
    const now = Date.now();
    for (const [key, lastSeen] of this.lastSeen) {
      if (now - lastSeen > this.throttlingPeriod) {
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

export default Throttle;

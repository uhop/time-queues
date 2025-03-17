// @ts-self-types="./Retainer.d.ts"

'use strict';

export class Retainer {
  constructor({create, destroy, retentionPeriod = 1_000}) {
    if (!create || !destroy) throw new Error('Retainer: create and destroy are required');
    this.create = create;
    this.destroy = destroy;
    this.retentionPeriod = retentionPeriod;
    this.counter = 0;
    this.handle = null;
    this.value = null;
  }

  async get() {
    if (!this.counter) {
      if (this.handle) {
        clearTimeout(this.handle);
        this.handle = null;
      } else {
        this.value = await this.create();
      }
    }
    ++this.counter;
    return this.value;
  }

  async release(immediately) {
    if (this.counter <= 0) throw new Error('Retainer: counter is already zero');
    if (--this.counter) return this;
    if (immediately) {
      const value = this.value;
      this.value = null;
      await this.destroy(value);
      return this;
    }
    this.handle = setTimeout(async () => {
      const value = this.value;
      this.value = null;
      this.handle = null;
      await this.destroy(value);
    }, this.retentionPeriod);
    return this;
  }
}

export default Retainer;

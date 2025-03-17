// @ts-self-types="./MicroTask.d.ts"

'use strict';

export class MicroTask {
  constructor(fn) {
    this.fn = fn;
  }
}

export default MicroTask;

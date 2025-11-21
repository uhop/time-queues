// @ts-self-types="./CancelTaskError.d.ts"

'use strict';

export class CancelTaskError extends Error {
  constructor() {
    super('Task was canceled');
    this.name = 'CancelTaskError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CancelTaskError);
    }
  }
}

export default CancelTaskError;

// @ts-self-types="./CancelTaskError.d.ts"

export class CancelTaskError extends Error {
  constructor(message = 'Task was canceled', options) {
    super(message, options);
    this.name = 'CancelTaskError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CancelTaskError);
    }
  }
}

export default CancelTaskError;

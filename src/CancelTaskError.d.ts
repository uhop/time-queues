/**
 * A cancellation error that is thrown when a microtask is canceled.
 */
export declare class CancelTaskError extends Error {
  constructor(message: string = 'Task was canceled', options?: ErrorOptions);
}

export default CancelTaskError;

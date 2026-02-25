/**
 * A cancellation error that is thrown when a microtask is canceled.
 */
export declare class CancelTaskError extends Error {
  name: 'CancelTaskError';
  constructor(message?: string, options?: ErrorOptions);
}

export default CancelTaskError;

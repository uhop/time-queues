declare module 'time-queues' {
  export * from './audit';
  export * from './batch';
  export * from './debounce';
  export * from './defer';
  export * from './sample';
  export * from './sleep';
  export * from './throttle';

  export * from './CancelTaskError';
  export * from './MicroTask';
  export * from './MicroTaskQueue';
  export * from './LimitedQueue';
  export * from './ListQueue';
  export * from './FrameQueue';
  export * from './IdleQueue';

  export * from './Counter';
  export * from './PageWatcher';
  export * from './Retainer';
  export * from './Scheduler';
  export * from './Throttler';

  export * from './random-dist';
  export * from './random-sleep';

  export * from './when-dom-loaded';
  export * from './when-loaded';
}

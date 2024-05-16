'use strict';

// a helper for PageWatcher

export const watchStates = (queue, resumeStatesList = ['active']) => {
  const resumeStates = new Set(resumeStatesList);

  // queues can be paused and resumed at any time
  // so we don't need to check if queue is paused
  // calling pause/resume multiple times is fine
  return state => {
    if (resumeStates.has(state)) {
      queue.resume();
    } else {
      queue.pause();
    }
  };
};

export default watchStates;

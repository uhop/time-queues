// @ts-self-types="./PageWatcher.d.ts"

'use strict';

import ListQueue from './ListQueue.js';

// Based on information from https://developer.chrome.com/docs/web-platform/page-lifecycle-api

const eventHandlerOptions = {capture: true},
  watchedEvents = ['pageshow', 'pagehide', 'focus', 'blur', 'visibilitychange', 'resume', 'freeze'];

// valid states: active, passive, hidden, frozen, terminated

const getState = () => {
  if (document.visibilityState === 'hidden') {
    return 'hidden';
  }
  if (document.hasFocus()) {
    return 'active';
  }
  return 'passive';
};

export class PageWatcher extends ListQueue {
  constructor(started) {
    super(!started);
    this.currentState = getState();
    if (started) this.resume();
  }

  pause() {
    this.paused = true;
    watchedEvents.forEach(type => removeEventListener(type, this, eventHandlerOptions));
    return super.pause();
  }

  resume() {
    watchedEvents.forEach(type => addEventListener(type, this, eventHandlerOptions));
    return super.resume();
  }

  enqueue(fn, initialize) {
    const task = super.enqueue(fn);
    if (initialize) queueMicrotask(() => fn(this.currentState, this.currentState, task, this));
    return task;
  }

  // Implemented in ListQueue: dequeue()

  clear() {
    this.list.clear();
    return this;
  }

  startQueue() {
    return null;
  }

  handleEvent(event) {
    let state = this.currentState;

    switch (event.type) {
      case 'freeze':
        state = 'frozen';
        break;
      case 'pagehide':
        state = event.persisted ? 'frozen' : 'terminated';
        break;
      default:
        state = getState();
        break;
    }

    if (this.currentState === state) return;

    for (const task of this.list) {
      task.fn(state, this.currentState, task, this);
    }

    this.currentState = state;
  }
}

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

export const pageWatcher = new PageWatcher();

export default pageWatcher;

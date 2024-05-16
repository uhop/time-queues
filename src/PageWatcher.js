'use strict';

import List from 'list-toolkit/List.js';
import MicroTask from './MicroTask.js';
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
    this.oldState = getState();
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
    if (initialize) queueMicrotask(() => fn(this.oldState, this.oldState, task, this));
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
    let state = this.oldState;

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

    if (this.oldState === state) return;

    for (const task of this.list) {
      task.fn(state, this.oldState, task, this);
    }

    this.oldState = state;
  }
}

export const pageWatcher = new PageWatcher();

export default pageWatcher;

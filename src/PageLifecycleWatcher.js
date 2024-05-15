'use strict';

import List from 'list-toolkit/List.js';
import MicroTask from './MicroTask.js';

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

export class PageLifecycleWatcher {
  constructor(started) {
    this.list = new List();
    this.oldState = 'passive';
    this.paused = !started;
    if (started) this.resume();
  }

  pause() {
    this.paused = true;
    watchedEvents.forEach(type => removeEventListener(type, this, eventHandlerOptions));
  }

  resume() {
    this.paused = false;
    this.oldState = getState();
    watchedEvents.forEach(type => addEventListener(type, this, eventHandlerOptions));
  }

  enqueue(fn) {
    const task = new MicroTask(fn);
    this.list.pushBack(task);
    return task;
  }

  dequeue(task) {
    for (const node of this.list.getNodeIterator()) {
      if (node.value === task) {
        this.list.remove(node);
        break;
      }
    }
    return this;
  }

  clear() {
    this.list.clear();
    return this;
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

export const pageLifecycleWatcher = new PageLifecycleWatcher();

export default pageLifecycleWatcher;

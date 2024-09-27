import pageWatcher, {watchStates} from 'time-queues/PageWatcher.js';

import whenDomLoaded from 'time-queues/when-dom-loaded.js';
import whenLoaded from 'time-queues/when-loaded.js';

import frameQueue from 'time-queues/FrameQueue.js';
import {defer} from 'time-queues/IdleQueue.js';
import scheduler, {repeat} from 'time-queues/Scheduler.js';

// reflect state in DOM

const reflectState = state => {
  defer(() => console.log('state:', state));
  frameQueue.enqueue(() => {
    document.documentElement.className = 'state-' + state;
    document.querySelector('h1 .state').textContent = state;
  });
};

pageWatcher.enqueue(state => reflectState(state), true);
pageWatcher.enqueue(watchStates(scheduler), true);
pageWatcher.resume();

// start tests

const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'cyan', 'magenta'],
  N = Math.min(colors.length, 10),
  shiftX = 100,
  shiftY = 100,
  sizeX = 300,
  sizeY = 300;

const moveRandomly = element => {
  element.style.left = `${shiftX + Math.random() * sizeX}px`;
  element.style.top = `${shiftY + Math.random() * sizeY}px`;
};

const createTestObject = color => {
  const element = document.createElement('div');
  element.className = 'test-object';
  element.style.backgroundColor = color;
  moveRandomly(element);
  return element;
};

// create objects
whenDomLoaded(() => {
  for (let i = 0; i < N; ++i) {
    const color = colors[i];

    defer(() => {
      const element = createTestObject(color);

      frameQueue.enqueue(() => {
        document.documentElement.appendChild(element);
        scheduler.enqueue(repeat(() => moveRandomly(element), 1000), 20);
      });
    });
  }
});

// log a page loading status when it is changed
whenDomLoaded(() => console.log('DOM loaded'));
whenLoaded(() => console.log('all loaded'));

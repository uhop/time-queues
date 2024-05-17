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

const moveObjectRandomly = obj => {
  obj.style.left = `${shiftX + Math.random() * sizeX}px`;
  obj.style.top = `${shiftY + Math.random() * sizeY}px`;
};

const moveAndRepeat = obj => repeat(() => moveObjectRandomly(obj), 1000);

// create objects
whenDomLoaded(() => {
  for (let i = 0; i < N; i++) {
    const color = colors[i];
    defer(() => {
      const obj = document.createElement('div');
      obj.className = 'test-object';
      obj.style.backgroundColor = color;
      moveObjectRandomly(obj);
      frameQueue.enqueue(() => {
        document.documentElement.appendChild(obj);
        scheduler.enqueue(moveAndRepeat(obj), 20);
      });
    });
  }
});

whenDomLoaded(() => console.log('DOM loaded'));
whenLoaded(() => console.log('all loaded'));

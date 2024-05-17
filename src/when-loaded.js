'use strict';

import List from 'list-toolkit/List.js';

const waitingForLoad = new List();

const handleLoaded = () => {
  while (!waitingForLoad.isEmpty) waitingForLoad.pop()();
};

export const whenLoaded = fn => {
  const wasEmpty = waitingForLoad.isEmpty;
  waitingForLoad.push(fn);

  if (document.readyState === 'complete') {
    queueMicrotask(handleLoaded);
    return;
  }

  if (wasEmpty) window.addEventListener('load', handleLoaded);
};

export default whenLoaded;

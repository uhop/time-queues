'use strict';

import List from 'list-toolkit/List.js';

const waitingForLoad = new List();

export const remove = fn => {
  for (const node of waitingForLoad.getNodeIterable()) {
    if (node.value === fn) {
      List.pop(node);
      return true;
    }
  }
  return false;
}

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

// @ts-self-types="./when-loaded.d.ts"

'use strict';

import ValueList from 'list-toolkit/value-list.js';

const waitingForLoad = new ValueList();

export const remove = fn => {
  for (const node of waitingForLoad.getNodeIterable()) {
    if (node.value === fn) {
      waitingForLoad.removeNode(node);
      return true;
    }
  }
  return false;
};

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

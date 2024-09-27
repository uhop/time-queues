'use strict';

import ValueList from 'list-toolkit/value-list.js';

const waitingForDom = new ValueList();

export const remove = fn => {
  for (const node of waitingForDom.getNodeIterable()) {
    if (node.value === fn) {
      waitingForDom.removeNode(node);
      return true;
    }
  }
  return false;
}

const handleDomLoaded = () => {
  while (!waitingForDom.isEmpty) waitingForDom.pop()();
};

export const whenDomLoaded = fn => {
  const wasEmpty = waitingForDom.isEmpty;
  waitingForDom.push(fn);

  switch (document.readyState) {
    case 'complete':
    case 'interactive':
      queueMicrotask(handleDomLoaded);
      return;
  }

  if (wasEmpty) document.addEventListener('DOMContentLoaded', handleDomLoaded);
};

export default whenDomLoaded;

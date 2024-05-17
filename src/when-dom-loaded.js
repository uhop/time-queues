'use strict';

import List from 'list-toolkit/List.js';

const waitingForDom = new List();

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

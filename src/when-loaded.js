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

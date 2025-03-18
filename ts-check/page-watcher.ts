import {pageWatcher} from '../src/PageWatcher.js';

const main = async () => {
  pageWatcher.pause();
  const task = pageWatcher.enqueue(() => {});
  pageWatcher.resume();
  pageWatcher.dequeue(task);
  if (!pageWatcher.isEmpty) pageWatcher.clear();
};

main();
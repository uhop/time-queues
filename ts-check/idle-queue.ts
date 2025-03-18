import {idleQueue} from '../src/IdleQueue.js';

const main = async () => {
  idleQueue.pause();
  const task = idleQueue.enqueue(() => {});
  idleQueue.resume();
  idleQueue.dequeue(task);
  if (!idleQueue.isEmpty) idleQueue.clear();
};

main();

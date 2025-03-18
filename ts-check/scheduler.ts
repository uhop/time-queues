import {scheduler, repeat} from '../src/Scheduler.js';

const main = async () => {
  scheduler.pause();
  const task = scheduler.enqueue(() => {}, 10);
  scheduler.resume();
  scheduler.dequeue(task);
  if (!scheduler.isEmpty) scheduler.clear();

  scheduler.enqueue(repeat(() => {}, 10), 50);
  
  await scheduler.schedule(100);
};

main();

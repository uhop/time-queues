'use strict';

import scheduler from '../../src/Scheduler.js';

const startTime = Date.now();

const ping = id => (task, scheduler) => {
  console.log(`${id}: ping ${task.delay}ms at ${(Date.now() - startTime) / 1000}s`);
  scheduler.enqueue(task.delay, task.fn);
};

console.log('Multiple pings. Exit with Ctrl-C.');

scheduler.enqueue(100, ping(1));
scheduler.enqueue(100, ping(2));
scheduler.enqueue(300, ping(3));
scheduler.enqueue(500, ping(5));

scheduler.enqueue(600, (_, scheduler) => {
  console.log(`Now we stop the queue for 0.4s at ${(Date.now() - startTime) / 1000}s...`);
  scheduler.pause();
  setTimeout(() => (console.log('...starting again'), scheduler.resume()), 400);
});

scheduler.enqueue(1500, (task, scheduler) => {
  console.log(`Now we stop the queue for good at ${(Date.now() - startTime) / 1000}s...`);
  scheduler.pause().clear();
});

const prohibitedTask = scheduler.enqueue(300, () => {
  throw new Error('Should not be called');
});

scheduler.enqueue(200, (_, scheduler) => {
  console.log(`We are removing the prohibited task at ${(Date.now() - startTime) / 1000}s...`);
  scheduler.dequeue(prohibitedTask);
});

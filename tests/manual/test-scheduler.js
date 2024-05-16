'use strict';

import scheduler from '../../src/Scheduler.js';

const startTime = Date.now();

const ping = id => (task, scheduler) => {
  console.log(`${id}: ping ${task.delay}ms at ${(Date.now() - startTime) / 1000}s`);
  scheduler.enqueue(task.delay, task.fn);
};

console.log('Multiple pings. Exit with Ctrl-C.');

scheduler.enqueue(1000, ping(1));
scheduler.enqueue(1000, ping(2));
scheduler.enqueue(3000, ping(3));
scheduler.enqueue(5000, ping(5));

scheduler.enqueue(10000, (_, scheduler) => {
  console.log(`Now we stop the queue for 5s at ${(Date.now() - startTime) / 1000}s...`);
  scheduler.pause();
  setTimeout(() => (console.log('...starting again'), scheduler.resume()), 5000);
});

scheduler.enqueue(20000, (task, scheduler) => {
  console.log(`Now we stop the queue for good at ${(Date.now() - startTime) / 1000}s...`);
  scheduler.pause().clear();
});

'use strict';

import scheduler, {repeat} from '../../src/Scheduler.js';

const startTime = Date.now();

const ping = id =>
  repeat(task => console.log(`${id}: ping ${task.delay}ms at ${(Date.now() - startTime) / 1000}s`));

console.log('Multiple pings. Exit with Ctrl-C.');

scheduler.enqueue(ping(1), 100);
scheduler.enqueue(ping(2), 100);
scheduler.enqueue(ping(3), 300);
scheduler.enqueue(ping(5), 500);

scheduler.enqueue((_, scheduler) => {
  console.log(`Now we stop the queue for 0.4s at ${(Date.now() - startTime) / 1000}s...`);
  scheduler.pause();
  setTimeout(() => (console.log('...starting again'), scheduler.resume()), 400);
}, 600);

scheduler.enqueue((task, scheduler) => {
  console.log(`Now we stop the queue for good at ${(Date.now() - startTime) / 1000}s...`);
  scheduler.pause().clear();
}, 1500);

const prohibitedTask = scheduler.enqueue(() => {
  throw new Error('Should not be called');
}, 300);

scheduler.enqueue((_, scheduler) => {
  console.log(`We are removing the prohibited task at ${(Date.now() - startTime) / 1000}s...`);
  scheduler.dequeue(prohibitedTask);
}, 200);

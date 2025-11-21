import {scheduler, repeat} from '../src/Scheduler.js';

const main = async () => {
  scheduler.pause();
  const task = scheduler.enqueue(() => {}, 10);
  scheduler.resume();
  scheduler.dequeue(task);
  if (!scheduler.isEmpty) scheduler.clear();

  scheduler.enqueue(
    repeat(() => {}, 10),
    50
  );

  await scheduler.schedule(null, 100).promise;

  const result = await (scheduler.schedule(() => 42, 100).promise as Promise<number>);
  console.log(result);
};

main();

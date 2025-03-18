import Throttler from '../src/Throttler.js';
import sleep from '../src/sleep.js';

const main = async () => {
  const throttler = new Throttler();

  await throttler.wait('a');
  await throttler.wait('b');
  await throttler.wait('a');

  if (throttler.isVacuuming) throttler.stopVacuum();
  throttler.startVacuum();

  const lastSeen = throttler.getLastSeen('a');
  void lastSeen;

  const delay = throttler.getDelay('a');
  await sleep(delay);
};

main();

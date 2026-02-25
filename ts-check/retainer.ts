import Retainer from '../src/Retainer.js';

const main = async () => {
  const retainer = new Retainer({
    create: () => Promise.resolve(1),
    destroy: () => Promise.resolve(),
    retentionPeriod: 1_000
  });

  const value1 = await retainer.get();
  void value1;
  await retainer.release();

  const value2 = await retainer.get();
  void value2;
  await retainer.release(true);
};

main();

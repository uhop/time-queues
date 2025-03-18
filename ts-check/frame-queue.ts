import {frameQueue} from '../src/FrameQueue.js';

const main = async () => {
  frameQueue.pause();
  const task = frameQueue.enqueue(() => {});
  frameQueue.resume();
  frameQueue.dequeue(task);
  if (!frameQueue.isEmpty) frameQueue.clear();
};

main();

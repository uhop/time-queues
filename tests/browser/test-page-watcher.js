import test from 'tape-six';

import {PageWatcher, watchStates} from 'time-queues/PageWatcher.js';
import {ListQueue} from 'time-queues/ListQueue.js';

const setVisibility = state =>
  Object.defineProperty(document, 'visibilityState', {configurable: true, get: () => state});
const setFocus = value => (document.hasFocus = () => value);
const restore = () => {
  delete document.visibilityState;
  delete document.hasFocus;
};

const makeActive = () => {
  setVisibility('visible');
  setFocus(true);
};

test('PageWatcher: visibility and focus transitions', t => {
  makeActive();
  const watcher = new PageWatcher(true);
  t.equal(watcher.currentState, 'active', 'starts active');

  const transitions = [];
  watcher.enqueue((state, prevState) => transitions.push([prevState, state]));

  setVisibility('hidden');
  document.dispatchEvent(new Event('visibilitychange', {bubbles: true}));
  t.equal(watcher.currentState, 'hidden', 'hidden after visibilitychange');

  setVisibility('visible');
  setFocus(false);
  document.dispatchEvent(new Event('visibilitychange', {bubbles: true}));
  t.equal(watcher.currentState, 'passive', 'passive when visible without focus');

  setFocus(true);
  dispatchEvent(new Event('focus'));
  t.equal(watcher.currentState, 'active', 'active after focus');

  dispatchEvent(new Event('focus'));
  t.deepEqual(
    transitions,
    [
      ['active', 'hidden'],
      ['hidden', 'passive'],
      ['passive', 'active']
    ],
    'listeners saw every transition once — same-state events are suppressed'
  );

  watcher.pause();
  restore();
});

test('PageWatcher: freeze and pagehide map to frozen/terminated', t => {
  makeActive();
  const watcher = new PageWatcher(true);
  const states = [];
  watcher.enqueue(state => states.push(state));

  dispatchEvent(new Event('freeze'));
  t.equal(watcher.currentState, 'frozen', 'freeze event freezes');

  dispatchEvent(new Event('resume'));
  t.equal(watcher.currentState, 'active', 'resume event returns to active');

  dispatchEvent(new PageTransitionEvent('pagehide', {persisted: true}));
  t.equal(watcher.currentState, 'frozen', 'persisted pagehide freezes');

  dispatchEvent(new Event('resume'));
  dispatchEvent(new PageTransitionEvent('pagehide', {persisted: false}));
  t.equal(watcher.currentState, 'terminated', 'non-persisted pagehide terminates');

  t.deepEqual(
    states,
    ['frozen', 'active', 'frozen', 'active', 'terminated'],
    'all transitions observed'
  );

  watcher.pause();
  restore();
});

test('PageWatcher: pause removes listeners, resume restores them', t => {
  makeActive();
  const watcher = new PageWatcher(true);
  let calls = 0;
  watcher.enqueue(() => ++calls);

  watcher.pause();
  setVisibility('hidden');
  document.dispatchEvent(new Event('visibilitychange', {bubbles: true}));
  t.equal(calls, 0, 'no callbacks while paused');
  t.equal(watcher.currentState, 'active', 'state unchanged while paused');

  watcher.resume();
  document.dispatchEvent(new Event('visibilitychange', {bubbles: true}));
  t.equal(calls, 1, 'callbacks resume with listeners');
  t.equal(watcher.currentState, 'hidden', 'state tracked again');

  watcher.pause();
  restore();
});

test('PageWatcher: enqueue with initialize fires immediately via microtask', async t => {
  makeActive();
  const watcher = new PageWatcher(true);
  const seen = [];
  watcher.enqueue((state, prevState) => seen.push([prevState, state]), true);
  t.deepEqual(seen, [], 'not synchronous');
  await Promise.resolve();
  t.deepEqual(seen, [['active', 'active']], 'initialized with the current state');
  watcher.pause();
  restore();
});

test('PageWatcher: watchStates routes queue pause/resume by state', t => {
  const queue = new ListQueue(true);
  const route = watchStates(queue, ['active']);
  t.ok(queue.paused, 'queue starts paused');
  route('active');
  t.notOk(queue.paused, 'resumed on a resume state');
  route('hidden');
  t.ok(queue.paused, 'paused on any other state');
});

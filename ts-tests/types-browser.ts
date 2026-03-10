import type {Task} from '../src/ListQueue.js';
import type {FrameQueue} from '../src/FrameQueue.js';
import type {IdleQueue} from '../src/IdleQueue.js';
import type {PageWatcher, PageState} from '../src/PageWatcher.js';
import type {ListQueue} from '../src/ListQueue.js';

// FrameQueue typing checks

declare const frameQueue: FrameQueue;

const _fqPaused: boolean = null! as FrameQueue['paused'];
const _fqBatch: number | undefined = null! as FrameQueue['batch'];
const _fqEmpty: boolean = null! as ReturnType<
  FrameQueue['isEmpty'] extends boolean ? () => boolean : never
>;

const _fqEnqueue: Task = frameQueue.enqueue(({timeStamp, task, queue}) => {
  const _ts: number = timeStamp;
  const _t: Task = task;
  const _q: FrameQueue = queue;
});

const _fqSchedule: Task = frameQueue.schedule(({timeStamp, task, queue}) => {
  void timeStamp;
  void task;
  void queue;
});

const _fqScheduleNull: Task = frameQueue.schedule(null);
const _fqDequeue: FrameQueue = frameQueue.dequeue(_fqEnqueue);
const _fqClear: FrameQueue = frameQueue.clear();
const _fqPause: FrameQueue = frameQueue.pause();
const _fqResume: FrameQueue = frameQueue.resume();
const _fqStart: (() => void) | null = frameQueue.startQueue();

// IdleQueue typing checks

declare const idleQueue: IdleQueue;

const _iqEnqueue: Task = idleQueue.enqueue(({deadline, task, queue}) => {
  const _dl: IdleDeadline = deadline;
  const _t: Task = task;
  const _q: IdleQueue = queue;
});

const _iqSchedule: Task = idleQueue.schedule(({deadline, task, queue}) => {
  void deadline;
  void task;
  void queue;
});

const _iqScheduleNull: Task = idleQueue.schedule(null);
const _iqOptions: IdleRequestOptions | undefined = idleQueue.options;
const _iqTimeoutBatch: number | undefined = idleQueue.timeoutBatch;

// PageWatcher typing checks

declare const pageWatcher: PageWatcher;

const _pwState: PageState = pageWatcher.currentState;
const _stateValues: PageState[] = ['active', 'passive', 'hidden', 'frozen', 'terminated'];

const _pwEnqueue: Task = pageWatcher.enqueue((state, previousState, task, queue) => {
  const _s: PageState = state;
  const _ps: PageState = previousState;
  const _t: Task = task;
  const _q: ListQueue = queue;
});

const _pwEnqueueInit: Task = pageWatcher.enqueue(() => {}, true);

// when-dom-loaded typing checks

import type {
  whenDomLoaded,
  remove as removeDom,
  scheduleWhenDomLoaded
} from '../src/when-dom-loaded.js';

declare const _wdl: typeof whenDomLoaded;
declare const _wdlRemove: typeof removeDom;
declare const _swdl: typeof scheduleWhenDomLoaded;

const _wdlVoid: void = _wdl(() => {});
const _wdlBool: boolean = _wdlRemove(() => {});
const _swdlNum: Promise<number> = _swdl(() => 42);
const _swdlVoid: Promise<void> = _swdl(null);
const _swdlVoid2: Promise<void> = _swdl();

// when-loaded typing checks

import type {whenLoaded, remove as removeLoaded, scheduleWhenLoaded} from '../src/when-loaded.js';

declare const _wl: typeof whenLoaded;
declare const _wlRemove: typeof removeLoaded;
declare const _swl: typeof scheduleWhenLoaded;

const _wlVoid: void = _wl(() => {});
const _wlBool: boolean = _wlRemove(() => {});
const _swlStr: Promise<string> = _swl(() => 'hello');
const _swlVoid: Promise<void> = _swl(null);
const _swlVoid2: Promise<void> = _swl();

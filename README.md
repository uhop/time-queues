# time-queues [![NPM version][npm-img]][npm-url]

[npm-img]: https://img.shields.io/npm/v/time-queues.svg
[npm-url]: https://npmjs.org/package/time-queues

`time-queues` is an efficient library for organizing asynchronous multitasking and scheduled tasks.
It can be used in a browser and in server-side environments like `Node`, `Deno` and `Bun`.
It depends only on [list-toolkit](https://github.com/uhop/list-toolkit), which is a no-dependency library for efficient task queues.

The following features are provided:

* All environments:
  * **Scheduler**: a `MinHeap`-based task queue that schedules time-based tasks in the future.
    * **repeat()**: a function that creates a repeatable task.
  * **defer()**: a function that executes a task at a later time in the next tick.
* Browsers:
  * Efficient multitasking:
    * **IdleQueue**: a task queue that executes tasks in the next idle period.
      * Based on [requestIdleCallback()](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback).
      * **defer()**: a function that executes a task at a later time in the next idle period.
    * **FrameQueue**: a task queue that executes tasks in the next frame.
      * Based on [requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).
  * Page state management:
    * **PageWatcher**: a task queue that executes tasks when the page state changes.
      * **watchStates()**: a helper that pauses and resumes queues when the page state changes.
    * **whenDomLoaded()**: a helper that executes tasks when the DOM is loaded.
    * **whenLoaded()**: a helper that executes tasks when the page is loaded.

Internally it uses [List Toolkit](https://github.com/uhop/list-toolkit) and leverages the following browser APIs:

* [requestIdleCallback()](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
* [requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
* [queueMicrotask()](https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask)
* [setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)
* Various events and properties.

There are many articles on the subject that detail how to leverage the APIs writing efficient applications.
Some of them are:

* [Background Tasks API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API)
* [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
* [Page Lifecycle API](https://developer.chrome.com/docs/web-platform/page-lifecycle-api)

This package eliminates the need to write code that you'll write anyway following best practices.

## Installation

```sh
npm install time-queues
```

If you want to check out the source code, you can use the following command:

```sh
git clone https://github.com/uhop/time-queues.git
cd time-queues
npm install
```

Don't forget to look at a test web application that uses the library. For that you should start a server:

```sh
npm start
```

And navigate to [http://localhost:3000/tests/web/](http://localhost:3000/tests/web/) &mdash;
don't forget to open the console and play around: switch tabs, make other window active,
navigate away and come back, and so on.
See how queues work in [tests/web/test.js](https://github.com/uhop/time-queues/blob/main/tests/web/test.js).

## Usage

The full documentation is available in the project's [wiki](https://github.com/uhop/time-queues/wiki). Below is a cheat sheet of the API.

### ListQueue

`ListQueue` is a list-based task queue that executes tasks in the order they were added.
It serves as a base class for other task queues. The following methods are available:

| Method | Description |
|:---|:---|
| `ListQueue(paused)` | Create a new list queue (paused optionally). |
| `isEmpty` | Check if the list queue is empty. |
| `pause()` | Pause the list queue. |
| `resume()` | Resume the list queue. |
| `enqueue(fn)` | Schedule a function to be executed. Returns the task. |
| `dequeue(task)` | Remove a task from the list queue. |
| `clear()` | Remove all tasks from the list queue. |

Subclasses should implement `startQueue()`.

### Scheduler

`Scheduler` is a `MinHeap`-based task queue that schedules time-based tasks in the future.
It can used to run periodic updates or one-time events.

`Scheduler` is not based on `ListQueue`, but implements its API.
The following additional methods are available:

| Method | Description |
|:---|:---|
| `Scheduler(paused)` | Create a new scheduler (paused optionally). |
| `nextTime` | Get the next scheduled time or 'Infinity` if the scheduler is empty. |
| `enqueue(fn, time)` | Schedule a function to be executed at a later time. Returns the task. `time` can be a date or a number in milliseconds from now. |

Scheduled functions are called once with the following arguments:

* `fn(task, scheduler)`, where:
  * `fn` &mdash; the scheduled function.
  * `task` &mdash; the task object that corresponds to the scheduled function.
  * `scheduler` &mdash; the scheduler object.

The return value is ignored.

The module provides a singleton ready to be used:

```js
import scheduler, {repeat} from 'time-queues/Scheduler.js';

// schedule a task
const task = scheduler.enqueue(() => console.log('The first task'), 1000);

// run a task every second
const hello = () => {
  console.log('Hello, world!');
  scheduler.enqueue(hello, 1000);
};
scheduler.enqueue(hello, 1000);

// pause the scheduler
scheduler.pause();

// remove the first task
scheduler.dequeue(task);

// remove all tasks
scheduler.clear();
```

#### repeat()

The module provides a helper function `repeat()` that creates a repeatable task:

* `repeat(fn, interval)`, where:
  * `fn` &mdash; the scheduled function.
  * `interval` &mdash; the interval in milliseconds. If not specified the corresponding task delay is used.

We can rewrite the above example using `repeat()`:

```js
// run a task every second
scheduler.enqueue(repeat(() => console.log('Hello, world!'), 1000));
```

### defer()

`defer(fn)` is a function that executes an argument function at a later time in the next tick.

Deferred functions are called with no arguments. The return value is ignored.

```js
import defer from 'time-queues/defer.js';

// run a task in the next tick
defer(() => console.log('Goodbye, world!'));

// run code now
console.log('Hello, world!');
```

### IdleQueue

`IdleQueue` is a task queue that executes tasks in the next idle period. It implements `ListQueue` and is based on [requestIdleCallback()](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback).

Efficient web applications should use `IdleQueue` to schedule computations required to prepare data and
even create necessary DOM elements.
See [Background Tasks API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API) for more information.

Queued functions are called once with the following arguments:

* `fn(deadline, task, idleQueue)`, where:
  * `fn` &mdash; the scheduled function.
  * `deadline` &mdash; the deadline object. See [requestIdleCallback()](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) for more information.
  * `task` &mdash; the task object that corresponds to the scheduled function.
  * `idleQueue` &mdash; the idle queue object.

The return value is ignored.

The module provides a singleton ready to be used:

```js
import idleQueue from 'time-queues/IdleQueue.js';
import frameQueue from 'time-queues/FrameQueue.js';

idleQueue.enqueue(() => {
  // prepare our data and generate DOM
  const div = document.createElement('div');
  div.appendChild(document.createTextNode('Hello, world!'));
  // now update the DOM in the next frame
  frameQueue.enqueue(() => document.body.appendChild(div));
});
```

### FrameQueue

`FrameQueue` is a task queue that executes tasks in the next frame. It implements `ListQueue` and is based on [requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

Efficient web applications should use `FrameQueue` to schedule DOM updates.
See [Background Tasks API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API) for more information.

Queued functions are called once with the following arguments:

* `fn(timeStamp, task, frameQueue)`, where:
  * `fn` &mdash; the scheduled function.
  * `timeStamp` &mdash; the timestamp object. See [requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) for more information.
  * `task` &mdash; the task object that corresponds to the scheduled function.
  * `frameQueue` &mdash; the frame queue object.

The return value is ignored.

The module provides a singleton ready to be used. See the code snippet `IdleQueue` above for more information.

### PageWatcher

`PageWatcher` is a task queue that executes tasks when the page state changes. It is based on [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API).
You can find more information in [Page Lifecycle API](https://developer.chrome.com/docs/web-platform/page-lifecycle-api).

Efficient web applications should use `PageWatcher` to watch for page visibility changes and react accordingly, for example, by suspending updates in the hidden state.

`PageWatcher` implements `ListQueue`. The following additional/changed methods are available:

| Method | Description |
|:---|:---|
| `PageWatcher(started)` | Create a new page watcher (started optionally). |
| `currentState` | Get the current page state (see below). |
| `enqueue(fn, initialize)` | Schedule a function to be executed. Returns the task. If `initialize` is truthy, the function will be queued and called immediately with the current state. |

A page state can be one of the following strings:

* `active` &mdash; the page is a current window, it is visible and the user can interact with it.
* `passive` &mdash; the page is not a current window, it is visible, but the user cannot interact with it.
* `hidden` &mdash; the page is not visible.
* `frozen` &mdash; the page is suspended, no timers nor fetch callbacks can be executed.
* `terminated` &mdash; the page is terminated, no new tasks can be started.

Queued functions are called on every state change with the following arguments:

* `fn(state, previousState, task, pageWatcher)`, where:
  * 'fn` &mdash; the scheduled function.
  * `state` &mdash; the new page state.
  * `previousState` &mdash; the previous page state.
  * `task` &mdash; the task object that corresponds to the scheduled function.
  * `pageWatcher` &mdash; the page watcher object.

The return value is ignored.

The module provides a singleton ready to be used.

```js
import pageWatcher from 'time-queues/PageWatcher.js';

pageWatcher.enqueue(state => console.log('state:', state), true);
```

#### watchStates()

`watchStates()` is a helper that pauses and resumes queues when the page state changes.
It can be added to a `PageWatcher` object controlling a `Scheduler` object or any other queue
to pause it depending on a page state.

The function signature is:

* `watchStates(queue, resumeStatesList = ['active'])`, where:
  * `queue` &mdash; the queue object to be controlled.
  * `resumeStatesList` &mdash; the iterable of page states to `resume()`. All other states will pause the queue. Defaults to 'active'.

The return value is a function that is suitable for `PageWatcher.enqueue()`.

```js
import pageWatcher, {watchStates} from 'time-queues/PageWatcher.js';
import scheduler from 'time-queues/Scheduler.js';

// do not process time-based tasks when the page is not visible
pageWatcher.enqueue(watchStates(scheduler, ['active', 'passive']), true);
```

### whenDomLoaded()

`whenDomLoaded()` is a helper that executes a function when the DOM is loaded.
If the DOM is already loaded, the function will be executed with `queueMicrotask()`.
Otherwise it'll be queued and executed when the DOM is loaded.
See [DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event) for more information.

The function signature is:

* `whenDomLoaded(fn)`, where:
  * `fn` &mdash; the function to be executed when the DOM is loaded.

It will be called with no arguments. The return value is ignored.

```js
import whenDomLoaded from 'time-queues/whenDomLoaded.js';

whenDomLoaded(() => console.log('The DOM is loaded'));
```

### whenLoaded()

`whenLoaded()` is a helper that executes a function when the page is fully loaded.
If the page is already loaded, the function will be executed with `queueMicrotask()`.
Otherwise it'll be queued and executed when the page is loaded.
See [load](https://developer.mozilla.org/en-US/docs/Web/Events/load) for more information.

The function signature is:

* `whenLoaded(fn)`, where:
  * `fn` &mdash; the function to be executed when the page is loaded.

It will be called with no arguments. The return value is ignored.

```js
import whenLoaded from 'time-queues/whenLoaded.js';

whenLoaded(() => console.log('The page is loaded'));
```

## License

This project is licensed under the BSD-3-Clause License.

## Release History

* 1.0.3 *Updated deps (`list-toolkit`) to fix a minor bug.*
* 1.0.2 *Updated deps (`list-toolkit`).*
* 1.0.1 *Minor update in README. No need to upgrade.*
* 1.0.0 *Initial release.*

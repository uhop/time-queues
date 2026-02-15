# time-queues [![NPM version][npm-img]][npm-url]

[npm-img]: https://img.shields.io/npm/v/time-queues.svg
[npm-url]: https://npmjs.org/package/time-queues

Lightweight library for asynchronous task scheduling and concurrency control in JavaScript. Works in browsers, Node.js, Deno, and Bun.

## Why time-queues?

Modern web apps need to schedule work without blocking the main thread, respect page lifecycle events, and limit concurrency &mdash; but the platform APIs are low-level and tedious to use correctly. `time-queues` wraps them in a small, composable toolkit:

- **Schedule tasks** to run after a delay, at a specific time, or on a recurring interval
- **Optimize browser performance** by running work during idle periods or animation frames
- **React to page lifecycle** changes (hidden, frozen, terminated) automatically
- **Control concurrency** with throttling, debouncing, batching, and rate limiting
- **Manage resources** with reference-counted creation/destruction
- **Minimal footprint** &mdash; one dependency ([list-toolkit](https://www.npmjs.com/package/list-toolkit), zero-dep)

## Installation

```sh
npm install time-queues
```

## Quick Start

```js
import sleep from 'time-queues/sleep.js';
import {Scheduler, repeat} from 'time-queues/Scheduler.js';
import {batch} from 'time-queues/batch.js';

// Simple delay
await sleep(1000);

// Run a task every 5 seconds
const scheduler = new Scheduler();
scheduler.enqueue(repeat(({task, scheduler}) => {
  console.log('tick');
}, 5000), 5000);

// Fetch 10 URLs, max 3 at a time
const results = await batch(
  urls.map(url => () => fetch(url).then(r => r.json())),
  3
);
```

See [examples/README.md](examples/README.md) for more use cases.

## Documentation

The [project wiki](https://github.com/uhop/time-queues/wiki) has detailed docs for every component.

### Queues

| Component | Purpose |
|---|---|
| [Scheduler](https://github.com/uhop/time-queues/wiki/Scheduler) | Time-based task scheduling (delays, dates, repeats) |
| [IdleQueue](https://github.com/uhop/time-queues/wiki/IdleQueue) | Run tasks during browser idle periods |
| [FrameQueue](https://github.com/uhop/time-queues/wiki/FrameQueue) | Run tasks in animation frames |
| [LimitedQueue](https://github.com/uhop/time-queues/wiki/LimitedQueue) | Concurrency-controlled async queue |
| [PageWatcher](https://github.com/uhop/time-queues/wiki/PageWatcher) | React to page lifecycle changes |

### Utilities

| Function | Purpose |
|---|---|
| [sleep()](<https://github.com/uhop/time-queues/wiki/sleep()>) | Promise-based delay |
| [defer()](<https://github.com/uhop/time-queues/wiki/defer()>) | Execute on next tick |
| [throttle()](<https://github.com/uhop/time-queues/wiki/throttle()>) | Rate-limit a function (first call wins) |
| [debounce()](<https://github.com/uhop/time-queues/wiki/debounce()>) | Delay until input stabilizes |
| [sample()](<https://github.com/uhop/time-queues/wiki/sample()>) | Sample at regular intervals |
| [audit()](<https://github.com/uhop/time-queues/wiki/audit()>) | Collect then execute after delay |
| [batch()](<https://github.com/uhop/time-queues/wiki/batch()>) | Run async ops with concurrency limit |

### Supporting Classes

| Component | Purpose |
|---|---|
| [Throttler](https://github.com/uhop/time-queues/wiki/Throttler) | Key-based rate limiting |
| [Retainer](https://github.com/uhop/time-queues/wiki/Retainer) | Resource lifecycle management |
| [Counter](https://github.com/uhop/time-queues/wiki/Counter) | Track pending task counts |
| [MicroTask](https://github.com/uhop/time-queues/wiki/MicroTask) | Base task unit |
| [MicroTaskQueue](https://github.com/uhop/time-queues/wiki/MicroTaskQueue) | Base queue class |
| [ListQueue](https://github.com/uhop/time-queues/wiki/ListQueue) | List-based queue implementation |

### Random Utilities

| Module | Purpose |
|---|---|
| [random-dist](https://github.com/uhop/time-queues/wiki/random-dist) | Random numbers (uniform, normal, exponential, Pareto) |
| [random-sleep](https://github.com/uhop/time-queues/wiki/random-sleep) | Randomized delays from various distributions |

### Page Load Helpers

| Function | Purpose |
|---|---|
| [whenDomLoaded()](<https://github.com/uhop/time-queues/wiki/whenDomLoaded()>) | Run code when DOM is ready |
| [whenLoaded()](<https://github.com/uhop/time-queues/wiki/whenLoaded()>) | Run code when page is fully loaded |

## Browser Notes

The library leverages these browser APIs where available:

- [requestIdleCallback()](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
- [requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [queueMicrotask()](https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask)
- [Page Lifecycle API](https://developer.chrome.com/docs/web-platform/page-lifecycle-api)

For background reading:

- [Background Tasks API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API)
- [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)

### Test web app

Run `npm start` and open [http://localhost:3000/tests/web/](http://localhost:3000/tests/web/) &mdash;
open the console, switch tabs, navigate away and back to see queues in action.
Source: [tests/web/test.js](https://github.com/uhop/time-queues/blob/main/tests/web/test.js).

## Development

```sh
git clone --recurse-submodules https://github.com/uhop/time-queues.git
cd time-queues
npm install
npm test
```

## License

BSD-3-Clause

## Release History

- 1.3.0 _Added `batch()`, `LimitedQueue`, random distributions and random sleep functions._
- 1.2.4 _Updated dependencies._
- 1.2.3 _Updated dependencies._
- 1.2.2 _`Counter`: separated old waiter from new waiters before notifying them._
- 1.2.1 _Minor release: updated formal TS dependencies in `index.d.ts`._
- 1.2.0 _Added `Counter`._
- 1.1.2 _Updated dev dependencies._
- 1.1.1 _Updates to TS typings._
- 1.1.0 _Added `Throttler`, `Retainer`, promise-based convenience time methods._
- 1.0.5 _Technical release: updated deps, more tests._
- 1.0.4 _Bug fixes and code simplifications._
- 1.0.3 _Updated deps (`list-toolkit`) to fix a minor bug._
- 1.0.2 _Updated deps (`list-toolkit`)._
- 1.0.1 _Minor update in README._
- 1.0.0 _Initial release._

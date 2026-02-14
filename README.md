# time-queues [![NPM version][npm-img]][npm-url]

[npm-img]: https://img.shields.io/npm/v/time-queues.svg
[npm-url]: https://npmjs.org/package/time-queues

`time-queues` is an efficient, lightweight library for organizing asynchronous multitasking and scheduled tasks in JavaScript applications. It works seamlessly in browsers and server-side environments like Node.js, Deno, and Bun.

The library provides elegant solutions for common timing and scheduling challenges, helping developers create responsive, efficient applications that follow best practices for resource management and user experience.

## Key Features

- **Efficient Task Scheduling**: Schedule tasks to run at specific times or after delays
- **Browser Performance Optimization**: Execute tasks during idle periods or animation frames
- **Page Lifecycle Management**: Respond intelligently to page visibility and focus changes
- **Resource Management**: Control execution rates with throttling and debouncing
- **Minimal Dependencies**: Relies only on [list-toolkit](https://www.npmjs.com/package/list-toolkit), a zero-dependency library

## Installation

```sh
npm install time-queues
```

If you want to check out the source code, you can use the following command:

```sh
git clone --recurse-submodules https://github.com/uhop/time-queues.git
cd time-queues
npm install
```

## Documentation

The [project wiki](https://github.com/uhop/time-queues/wiki) provides comprehensive information about the `time-queues` library.

### Core Task Queue Classes

- [MicroTask](https://github.com/uhop/time-queues/wiki/MicroTask): Base class for deferred execution
- [MicroTaskQueue](https://github.com/uhop/time-queues/wiki/MicroTaskQueue): Base class for task queues
- [ListQueue](https://github.com/uhop/time-queues/wiki/ListQueue): List-based queue implementation

### Concurrency Control

- [LimitedQueue](https://github.com/uhop/time-queues/wiki/LimitedQueue): Queue with controlled concurrency
- [Throttler](https://github.com/uhop/time-queues/wiki/Throttler): Control execution rate based on keys
- [Counter](https://github.com/uhop/time-queues/wiki/Counter): Track pending task counts

### Browser-Specific Components

- [IdleQueue](https://github.com/uhop/time-queues/wiki/IdleQueue): Execute tasks during browser idle periods
- [FrameQueue](https://github.com/uhop/time-queues/wiki/FrameQueue): Execute tasks during animation frames
- [PageWatcher](https://github.com/uhop/time-queues/wiki/PageWatcher): Monitor and respond to page lifecycle changes

### Scheduling & Timing

- [Scheduler](https://github.com/uhop/time-queues/wiki/Scheduler): Time-based task scheduling
- [Retainer](https://github.com/uhop/time-queues/wiki/Retainer): Resource lifecycle management

### Utility Functions

- [defer()](<https://github.com/uhop/time-queues/wiki/defer()>): Execute tasks in the next tick
- [sleep()](<https://github.com/uhop/time-queues/wiki/sleep()>): Promise-based delay function
- [throttle()](<https://github.com/uhop/time-queues/wiki/throttle()>): Limit function execution rate
- [debounce()](<https://github.com/uhop/time-queues/wiki/debounce()>): Delay function execution until input stabilizes
- [sample()](<https://github.com/uhop/time-queues/wiki/sample()>): Execute function at regular intervals
- [audit()](<https://github.com/uhop/time-queues/wiki/audit()>): Execute function after specified delay
- [batch()](<https://github.com/uhop/time-queues/wiki/batch()>): Execute async operations with controlled concurrency

### Random Distribution Utilities

- [random-dist](https://github.com/uhop/time-queues/wiki/random-dist): Generate random numbers from various probability distributions
- [random-sleep](https://github.com/uhop/time-queues/wiki/random-sleep): Create randomized delays with various probability distributions

## Getting Started

To get started with `time-queues`, install it via npm:

```sh
npm install time-queues
```

Then import the components you need in your project:

```js
// Import specific components
import {Scheduler, repeat} from 'time-queues/Scheduler.js';
import idleQueue from 'time-queues/IdleQueue.js';
import defer from 'time-queues/defer.js';

// Use the components in your application
```

For more information, see the documentation for each component in the wiki.

## Browser-related notes

Internally it uses `list-toolkit` and leverages the following browser APIs:

- [requestIdleCallback()](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
- [requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [queueMicrotask()](https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask)
- [setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)
- Various events and properties.

There are many articles on the subject that detail how to leverage the APIs writing efficient applications.
Some of them are:

- [Background Tasks API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API)
- [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- [Page Lifecycle API](https://developer.chrome.com/docs/web-platform/page-lifecycle-api)

This package eliminates the need to write code that you'll write anyway following best practices.

### Running a test web application

Don't forget to look at a test web application that uses the library. For that you should start a server:

```sh
npm start
```

And navigate to [http://localhost:3000/tests/web/](http://localhost:3000/tests/web/) &mdash;
don't forget to open the console and play around: switch tabs, make other window active,
navigate away and come back, and so on.
See how queues work in [tests/web/test.js](https://github.com/uhop/time-queues/blob/main/tests/web/test.js).

## License

This project is licensed under the BSD-3-Clause License.

## Release History

- 1.3.0 _Added `batch()` and `LimitedQueue` to run asynchronous operations with controlled concurrency, random distribuitions and random sleep functions, updated dependencies, minor improvements._
- 1.2.4 _Updated dependencies._
- 1.2.3 _Updated dependencies._
- 1.2.2 _`Counter`: separated old waiter from new waiters before notifying them._
- 1.2.1 _Minor release: updated formal TS dependencies in `index.d.ts`._
- 1.2.0 _Added `Counter`. Updated dev dependencies._
- 1.1.2 _Updated dev dependencies. No need to upgrade._
- 1.1.1 _Updates to TS typings._
- 1.1.0 _Added `Throttler`, `Retainer`, promise-based convenience time methods._
- 1.0.5 _Technical release: updated deps, more tests._
- 1.0.4 _Bug fixes and code simplifications._
- 1.0.3 _Updated deps (`list-toolkit`) to fix a minor bug._
- 1.0.2 _Updated deps (`list-toolkit`)._
- 1.0.1 _Minor update in README. No need to upgrade._
- 1.0.0 _Initial release._

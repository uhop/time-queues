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

## Usage

The full documentation is available in the project's [wiki](https://github.com/uhop/time-queues/wiki). Below is a summary of the most important parts of the documentation:

### Resource Management

- [Scheduler](https://github.com/uhop/time-queues/wiki/Scheduler): Time-based task scheduling
- [Retainer](https://github.com/uhop/time-queues/wiki/Retainer): Manage resource lifecycle
- [Throttler](https://github.com/uhop/time-queues/wiki/Throttler): Control execution rate based on keys
- [Counter](https://github.com/uhop/time-queues/wiki/Counter): Track the number of pending tasks asynchronously

### Browser-Specific Components

- [IdleQueue](https://github.com/uhop/time-queues/wiki/IdleQueue): Execute tasks during browser idle periods
- [FrameQueue](https://github.com/uhop/time-queues/wiki/FrameQueue): Execute tasks during animation frames
- [PageWatcher](https://github.com/uhop/time-queues/wiki/PageWatcher): Monitor and respond to page lifecycle changes

### Utility Functions

- [defer()](<https://github.com/uhop/time-queues/wiki/defer()>): Execute tasks in the next tick
- [sleep()](<https://github.com/uhop/time-queues/wiki/sleep()>): Promise-based delay function
- [throttle()](<https://github.com/uhop/time-queues/wiki/throttle()>): Limit function execution rate
- [debounce()](<https://github.com/uhop/time-queues/wiki/debounce()>): Delay function execution until input stabilizes
- [sample()](<https://github.com/uhop/time-queues/wiki/sample()>): Execute function at regular intervals
- [audit()](<https://github.com/uhop/time-queues/wiki/audit()>): Execute function after specified delay

## License

This project is licensed under the BSD-3-Clause License.

## Release History

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

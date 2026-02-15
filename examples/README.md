# time-queues Examples

*Copy-pasteable examples for common use cases*

## Table of Contents

1. [Basic Task Scheduling](#basic-task-scheduling)
2. [Background Processing](#background-processing)
3. [Animation Frame Updates](#animation-frame-updates)
4. [Rate Limiting](#rate-limiting)
5. [Batch Processing](#batch-processing)
6. [Resource Management](#resource-management)
7. [Custom Queue Implementation](#custom-queue-implementation)

---

## Basic Task Scheduling

### Simple Delay
```javascript
import { sleep } from 'time-queues';

// Sleep for 1 second
await sleep(1000);
console.log('1 second passed');
```

### Schedule Recurring Tasks
```javascript
import { Scheduler, repeat } from 'time-queues/Scheduler.js';

const scheduler = new Scheduler();

// Run every 5 seconds
const task = scheduler.enqueue(repeat(({task, scheduler}) => {
  console.log('Running every 5 seconds');
}, 5000), 5000);

// Stop after some time
setTimeout(() => {
  scheduler.dequeue(task);
}, 30000);
```

### Defer to Next Tick
```javascript
import { defer } from 'time-queues';

// Execute after current synchronous code completes
defer(() => {
  console.log('This runs after the current call stack clears');
});
```

---

## Background Processing

### Browser Idle Processing
```javascript
import { IdleQueue } from 'time-queues/IdleQueue.js';

const idleQueue = new IdleQueue();

// Process low-priority work during browser idle time
for (const item of largeDataset) {
  idleQueue.enqueue(({deadline, task, queue}) => processItem(item));
}

// Pause when user switches tabs
window.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    idleQueue.pause();
  } else {
    idleQueue.resume();
  }
});
```

---

## Animation Frame Updates

### Smooth Animation
```javascript
import { FrameQueue } from 'time-queues/FrameQueue.js';

const frameQueue = new FrameQueue();

// Update animation on every frame
function updateAnimation() {
  frameQueue.enqueue(({ timeStamp, task, queue }) => {
    const progress = timeStamp / 1000; // seconds
    element.style.transform = `translateX(${progress * 100}px)`;

    // Continue animating
    updateAnimation();
  });
}

updateAnimation();

// Stop animation when done
function stopAnimation() {
  frameQueue.clear();
}
```

---

## Rate Limiting

### Throttle Function Calls
```javascript
import { throttle } from 'time-queues';

// Limit to once per 500ms
const throttledScroll = throttle((event) => {
  console.log('Scroll position:', window.scrollY);
}, 500);

window.addEventListener('scroll', throttledScroll);
```

### Debounce Input
```javascript
import { debounce } from 'time-queues';

// Wait 300ms after user stops typing
const debouncedSearch = debounce((query) => {
  fetch(`/search?q=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(results => displayResults(results));
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

### Throttle by Key (Different limits per resource)
```javascript
import { Throttler } from 'time-queues/Throttler.js';

const throttler = new Throttler({ throttleTimeout: 1000 });

// Each API endpoint has its own throttle
async function fetchWithThrottle(key, url) {
  await throttler.wait(key);
  return fetch(url);
}

await fetchWithThrottle('users', '/api/users');
await fetchWithThrottle('posts', '/api/posts');
```

---

## Batch Processing

### Controlled Concurrency
```javascript
import { batch } from 'time-queues/batch.js';
import { LimitedQueue } from 'time-queues/LimitedQueue.js';

// Process URLs with max 3 concurrent requests using batch()
const urls = ['url1', 'url2', 'url3', 'url4', 'url5'];
const results = await batch(
  urls.map(url => async () => {
    const response = await fetch(url);
    return response.json();
  }),
  3 // concurrency limit
);

// Or use LimitedQueue directly
const queue = new LimitedQueue(3);

for (const url of urls) {
  queue.enqueue(async ({task, queue}) => {
    const response = await fetch(url);
    return response.json();
  });
}

await queue.waitForIdle();
```

---

## Resource Management

### Lifecycle Managed Resource
```javascript
import { Retainer } from 'time-queues/Retainer.js';

// Database connection pool
const dbPool = new Retainer({
  create: async () => {
    const connection = await createDatabaseConnection();
    return connection;
  },
  destroy: async (connection) => {
    await connection.close();
  },
  retentionPeriod: 30000 // Keep alive for 30s after last release
});

// Get connection (creates if needed)
const connection = await dbPool.get();
try {
  await connection.query('SELECT * FROM users');
} finally {
  await dbPool.release();
}
```

---

## Custom Queue Implementation

### Throttled Queue with Logging
```javascript
import { ListQueue } from 'time-queues/ListQueue.js';

class LoggingThrottledQueue extends ListQueue {
  constructor(options = {}) {
    super(options.paused);
    this.interval = options.interval || 1000;
    this.timerId = null;
  }

  startQueue() {
    console.log('Queue processing started');

    const processNext = () => {
      if (this.list.isEmpty) {
        this.stopQueue = null;
        return;
      }

      const task = this.list.popFront();
      console.log('Processing task:', task.fn.name || 'anonymous');

      try {
        task.fn({task, queue: this});
      } catch (error) {
        // handle error
      }

      // Schedule next task
      this.timerId = setTimeout(processNext, this.interval);
    };

    // Start first task immediately
    this.timerId = setTimeout(processNext, 0);

    // Return stop function
    return () => {
      console.log('Queue processing stopped');
      clearTimeout(this.timerId);
      this.timerId = null;
    };
  }
}

// Usage
const queue = new LoggingThrottledQueue({ interval: 2000 });

queue.enqueue(() => console.log('Task 1'));
queue.enqueue(() => console.log('Task 2'));
queue.enqueue(() => console.log('Task 3'));

// Tasks run 2 seconds apart
```

---

*For more examples, see the [project wiki](https://github.com/uhop/time-queues/wiki)*

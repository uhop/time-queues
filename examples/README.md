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
const task = scheduler.schedule(() => {
  console.log('Running every 5 seconds');
}, { delay: 5000, repeat: repeat.every(5000) });

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
import { IdleQueue } from 'time-queues';

const idleQueue = new IdleQueue();

// Process low-priority work during browser idle time
for (const item of largeDataset) {
  idleQueue.enqueue(() => processItem(item));
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
import { FrameQueue } from 'time-queues';

const frameQueue = new FrameQueue();

// Update animation on every frame
function updateAnimation() {
  frameQueue.enqueue(({ timeStamp }) => {
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
import { Throttler } from 'time-queues';

const throttler = new Throttler({ delay: 1000 });

// Each API endpoint has its own throttle
throttler.enqueue(() => fetch('/api/users'), 'users');
throttler.enqueue(() => fetch('/api/posts'), 'posts');
```

---

## Batch Processing

### Controlled Concurrency
```javascript
import { batch, LimitedQueue } from 'time-queues';

// Process URLs with max 3 concurrent requests
const urls = ['url1', 'url2', 'url3', 'url4', 'url5'];
const results = await batch(urls, async (url) => {
  const response = await fetch(url);
  return response.json();
}, { concurrency: 3 });

// Or use LimitedQueue directly
const queue = new LimitedQueue({ concurrency: 3 });

for (const url of urls) {
  queue.enqueue(async () => {
    const response = await fetch(url);
    return response.json();
  });
}
```

---

## Resource Management

### Lifecycle Managed Resource
```javascript
import { Retainer } from 'time-queues';

// Database connection pool
const dbPool = new Retainer({
  create: async () => {
    const connection = await createDatabaseConnection();
    return connection;
  },
  destroy: async (connection) => {
    await connection.close();
  },
  maxAge: 30000 // Recreate every 30 seconds
});

// Get connection (creates if needed)
const connection = await dbPool.retain();
try {
  await connection.query('SELECT * FROM users');
} finally {
  dbPool.release(connection);
}
```

---

## Custom Queue Implementation

### Throttled Queue with Logging
```javascript
import { ListQueue } from 'time-queues';

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
      
      task.makePromise();
      try {
        const result = task.fn();
        task.resolve(result);
      } catch (error) {
        task.cancel(error);
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

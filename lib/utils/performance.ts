/**
 * Performance optimization utilities
 */

/**
 * Breaks up long-running tasks into smaller chunks to avoid blocking the main thread
 */
export function* createTaskQueue<T>(tasks: T[]): Generator<T[], void, unknown> {
  const CHUNK_SIZE = 5; // Process 5 items at a time
  
  for (let i = 0; i < tasks.length; i += CHUNK_SIZE) {
    yield tasks.slice(i, i + CHUNK_SIZE);
  }
}

/**
 * Process tasks with requestIdleCallback for better performance
 */
export async function processTasksInIdle<T>(
  tasks: T[],
  processor: (task: T) => void | Promise<void>,
  options?: { timeout?: number }
): Promise<void> {
  const queue = createTaskQueue(tasks);
  
  return new Promise((resolve) => {
    const processNextChunk = () => {
      const { value: chunk, done } = queue.next();
      
      if (done) {
        resolve();
        return;
      }
      
      if ('requestIdleCallback' in window) {
        requestIdleCallback(
          async (deadline) => {
            for (const task of chunk) {
              if (deadline.timeRemaining() > 0) {
                await processor(task);
              } else {
                // Re-queue remaining tasks
                tasks.push(task);
              }
            }
            processNextChunk();
          },
          { timeout: options?.timeout ?? 2000 }
        );
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(async () => {
          for (const task of chunk) {
            await processor(task);
          }
          processNextChunk();
        }, 16); // ~60fps
      }
    };
    
    processNextChunk();
  });
}

/**
 * Debounce function with leading and trailing options
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let result: ReturnType<T>;
  let lastCallTime: number | null = null;
  let lastInvokeTime = 0;

  const { leading = false, trailing = true } = options;

  const invokeFunc = (time: number, args: Parameters<T>) => {
    lastInvokeTime = time;
    result = func(...args);
    return result;
  };

  const shouldInvoke = (time: number): boolean => {
    const timeSinceLastCall = lastCallTime ? time - lastCallTime : 0;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === null ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      timeSinceLastInvoke >= wait
    );
  };

  const trailingEdge = (time: number, args: Parameters<T>) => {
    timeout = null;
    if (trailing && lastCallTime) {
      return invokeFunc(time, args);
    }
    lastCallTime = null;
    return result;
  };

  const timerExpired = (args: Parameters<T>) => {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time, args);
    }
    timeout = setTimeout(() => timerExpired(args), wait);
  };

  return function debounced(...args: Parameters<T>) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastCallTime = time;

    if (isInvoking) {
      if (timeout === null && leading) {
        return invokeFunc(time, args);
      }
      if (timeout === null) {
        timeout = setTimeout(() => timerExpired(args), wait);
      }
    }
  };
}

/**
 * Throttle function for performance-critical operations
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastResult: ReturnType<T>;

  return function throttled(...args: Parameters<T>) {
    if (!inThrottle) {
      lastResult = func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
    return lastResult;
  };
}

/**
 * Memoize expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    
    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }

    return result;
  }) as T;
}
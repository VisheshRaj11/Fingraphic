import { acquireDistributedLock } from '../config/redis';

const SLEEP = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Throttles Gemini API calls to 1 call per 4 seconds using Redis distributed locks.
 * Implements exponential backoff retries at 4s, 8s, 16s on failure.
 */
export async function executeWithRateLimit<T>(
  action: () => Promise<T>,
  lockKey = 'lock:gemini:call'
): Promise<T> {
  const retryDelaysMs = [4000, 8000, 16000];
  let attempt = 0;

  while (true) {
    const lockAcquired = await acquireDistributedLock(lockKey, 4000);

    if (lockAcquired) {
      try {
        const result = await action();
        // Wait remainder of 4 seconds to ensure 1 call per 4 sec interval
        await SLEEP(4000);
        return result;
      } catch (error: any) {
        console.error(`[RateLimiter] Error during API call (attempt ${attempt + 1}):`, error.message);
        if (attempt >= retryDelaysMs.length) {
          throw error;
        }
        const delay = retryDelaysMs[attempt];
        attempt++;
        console.log(`[RateLimiter] Backing off for ${delay / 1000}s...`);
        await SLEEP(delay);
      }
    } else {
      // Lock not acquired, wait 500ms and try again
      await SLEEP(500);
    }
  }
}

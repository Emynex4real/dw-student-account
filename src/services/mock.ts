/**
 * Simulates network latency for mock API calls.
 * Wrap your mock data returns with this helper so that components
 * experience the same async behaviour they will with real HTTP calls.
 * 
 * @param data - The mock data to return
 * @param delayMs - Simulated latency in milliseconds (default 800ms)
 */
export function mockDelay<T>(data: T, delayMs = 800): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs);
  });
}

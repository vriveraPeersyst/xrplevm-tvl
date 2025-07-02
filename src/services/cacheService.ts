export class LocalStorageCacheService {
  constructor(private cacheKey: string, private cacheDuration: number) {}

  get<T>(): T | null {
    const item = localStorage.getItem(this.cacheKey);
    if (!item) return null;
    const parsed = JSON.parse(item);
    if (
      parsed.timestamp &&
      Date.now() - parsed.timestamp > this.cacheDuration
    ) {
      localStorage.removeItem(this.cacheKey);
      return null;
    }
    return parsed.value as T;
  }

  set<T>(value: T): void {
    localStorage.setItem(
      this.cacheKey,
      JSON.stringify({
        value,
        timestamp: Date.now(),
      })
    );
  }
}

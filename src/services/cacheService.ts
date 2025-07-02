export class LocalStorageCacheService {
  private cacheKey: string;
  private cacheDuration: number;

  constructor(cacheKey: string, cacheDuration: number) {
    this.cacheKey = cacheKey;
    this.cacheDuration = cacheDuration;
  }

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

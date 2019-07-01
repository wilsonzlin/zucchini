export class JMap<K, V> implements Map<K, V> {
  private readonly map: Map<K, V>;

  public constructor (entries?: ReadonlyArray<readonly [K, V]> | null) {
    this.map = new Map(entries);
  }

  get [Symbol.toStringTag] (): string {
    return this.map[Symbol.toStringTag];
  }

  get size (): number {
    return this.map.size;
  }

  [Symbol.iterator] (): IterableIterator<[K, V]> {
    return this.map[Symbol.iterator]();
  }

  clear (): void {
    this.map.clear();
  }

  toPlainObject (): { [key: string]: V } {
    const obj = Object.create(null);
    for (const [key, value] of this.entries()) {
      obj[key] = value;
    }
    return obj;
  }

  entries (): IterableIterator<[K, V]> {
    return this.map.entries();
  }

  forEach (callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
    this.map.forEach(callbackfn, thisArg);
  }

  get (key: K): V | undefined {
    return this.map.get(key);
  }

  getOrDefault (key: K, defaultValue: V): V {
    const value = this.map.get(key);
    if (value === undefined) {
      return defaultValue;
    }
    return value;
  }

  has (key: K): boolean {
    return this.map.has(key);
  }

  contains (key: K): boolean {
    return this.has(key);
  }

  keys (): IterableIterator<K> {
    return this.map.keys();
  }

  set (key: K, value: V): this {
    this.map.set(key, value);
    return this;
  }

  values (): IterableIterator<V> {
    return this.map.values();
  }

  delete (key: K): boolean {
    return this.map.delete(key);
  }

  computeIfAbsent (key: K, provider: (key: K) => V): V {
    if (!this.map.has(key)) {
      this.map.set(key, provider(key));
    }
    return this.map.get(key)!;
  }

  putIfAbsent (key: K, value: V): V {
    if (!this.map.has(key)) {
      this.map.set(key, value);
    }
    return this.map.get(key)!;
  }
}

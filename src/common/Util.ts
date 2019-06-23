export const minMax = (min: number, max: number, val: number): number => {
  return Math.max(min, Math.min(max, val));
};

export const concatThenDeduplicate = <V> (...arrays: V[][]): V[] => {
  const set = new Set<V>();
  for (const array of arrays) {
    for (const value of array) {
      set.add(value);
    }
  }
  return [...set];
};

export const undefinedFallback = <V, F = V> (value: V | undefined, fallback: V): V => {
  if (value === undefined) {
    return fallback;
  }
  return value;
};

export enum ComparisonOrder {
  ASC, DESC,
}

export enum NullComparisonBehaviour {
  FIRST, LAST
}

export type Comparator<V> = (a: V, b: V) => number;

export const compareNullable = <V> (order: ComparisonOrder = ComparisonOrder.ASC, nullBehaviour: NullComparisonBehaviour = NullComparisonBehaviour.LAST): Comparator<V> => {
  // By default, the comparator returns -1 if A < B (i.e. ascending).
  // This is flipped by multiplying by -1 if the order is DESC.
  const orderMultiplier = order == ComparisonOrder.ASC ? 1 : -1;
  // By default, the comparator always treats null as the greatest value.
  // This is flipped by multiplying by -1 if the behaviour is FIRST.
  const nullOrderMultiplier = nullBehaviour == NullComparisonBehaviour.LAST ? 1 : -1;
  return (valA: V, valB: V) => {
    // If one is null, then it will always come after the other unless the other is null as well.
    if (valA === null || valB === null) {
      return (valA === null ? 1 :
        valB === null ? 0 :
          -1) * nullOrderMultiplier * orderMultiplier;
    }
    return (valA < valB ? -1 :
      valA > valB ? 1 :
        0) * orderMultiplier;
  };
};

export const compareProperties = <O, K extends keyof O> (key: K, propertyComparator: Comparator<O[K]>): Comparator<O> => {
  return (objA: O, objB: O) => {
    const valA = objA[key];
    const valB = objB[key];
    return propertyComparator(valA, valB);
  };
};

export const computePropertyIfAbsent = <O, P extends keyof O> (obj: O, prop: P, provider: (prop: P, obj: O) => O[P]): O[P] => {
  // Object might have no prototype.
  if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
    obj[prop] = provider(prop, obj);
  }
  return obj[prop];
};

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

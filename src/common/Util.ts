export const minMax = (min: number, max: number, val: number): number => {
  return Math.max(min, Math.min(max, val));
};

export const escapeRegExp = (s: string): string => {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export function plural (format: string, value: number): string;
export function plural (format: string, values: { [delimiter: string]: number }): string;
export function plural (format: string, values: number | { [delimiter: string]: number }) {
  if (typeof values == "number") {
    values = {
      "{}": values,
    };
  }
  let result = format;
  for (const [valSub, value] of Object.entries(values)) {
    const isPlural = value != 1;
    const valSubRegex = new RegExp(escapeRegExp(valSub), "g");
    const pluralSwitchRegex = new RegExp(`\\${valSub[0]}(.*?):(.*?)\\${valSub[1]}`, "g");
    result = result
      .replace(valSubRegex, `${value}`)
      .replace(pluralSwitchRegex, (_, singular, plural) => isPlural ? plural : singular);
  }
  return result;
}

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

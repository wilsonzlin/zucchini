export const minMax = (min: number, max: number, val: number): number => {
  return Math.max(min, Math.min(max, val));
};

export const escapeRegExp = (s: string): string => {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export function plural (format: string, value: number): string;
export function plural (format: string, values: { [delimiter: string]: number }): string;
export function plural (format: string, values: number | { [delimiter: string]: number }) {
  if (typeof values == 'number') {
    values = {
      '{}': values,
    };
  }
  let result = format;
  for (const [valSub, value] of Object.entries(values)) {
    const isPlural = value != 1;
    const valSubRegex = new RegExp(escapeRegExp(valSub), 'g');
    const pluralSwitchRegex = new RegExp(`\\${valSub[0]}(.*?):(.*?)\\${valSub[1]}`, 'g');
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

export const mapOptional = <V, R> (value: V | null | undefined, mapper: (v: V) => R, def: R): R => {
  return value == null ? def : mapper(value);
};

export const computePropertyIfAbsent = <O, P extends keyof O> (obj: O, prop: P, provider: (prop: P, obj: O) => O[P]): O[P] => {
  // Object might have no prototype.
  if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
    obj[prop] = provider(prop, obj);
  }
  return obj[prop];
};

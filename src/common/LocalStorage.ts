export const KEY_PREFIX = "zucchini_";

abstract class LSKey {
  readonly name: string;

  protected constructor (name: string) {
    this.name = name;
  }
}

class LSNumKey extends LSKey {
  constructor (name: string) {
    super(name);
  }
}

class LSStrKey extends LSKey {
  constructor (name: string) {
    super(name);
  }
}

const buildKey = (key: LSKey): string => {
  return `${KEY_PREFIX}${key.name}`;
};

const hasKey = (key: LSKey): boolean => {
  return localStorage.getItem(buildKey(key)) != null;
};

const assertGetRawKey = (key: LSKey): string => {
  const val = localStorage.getItem(buildKey(key));
  if (val == null) {
    throw new ReferenceError(`Key doesn't exist`);
  }
  return val;
};

const setRawKey = (key: LSKey, rawValue: any): void => {
  localStorage.setItem(buildKey(key), rawValue);
};

export function getKey (key: LSNumKey): number;
export function getKey (key: LSStrKey): string;
export function getKey (key: LSKey): number | string {
  if (key instanceof LSNumKey) {
    return Number.parseFloat(assertGetRawKey(key));
  } else if (key instanceof LSStrKey) {
    return assertGetRawKey(key);
  } else {
    throw new Error("This should never happen");
  }
}

export function getKeyOrDefault (key: LSNumKey, def: number): number;
export function getKeyOrDefault (key: LSStrKey, def: string): string;
export function getKeyOrDefault (key: LSKey, def: number | string): number | string {
  if (!hasKey(key)) {
    return def;
  }
  return getKey(key);
}

export function setKey (key: LSNumKey, value: number): number;
export function setKey (key: LSStrKey, value: string): string;
export function setKey (key: LSKey, value: number | string): number | string {
  if (key instanceof LSNumKey) {
    setRawKey(key, value.toString());
  } else if (key instanceof LSStrKey) {
    setRawKey(key, value);
  } else {
    throw new Error("This should never happen");
  }
  return value;
}

export const PLAYER_VOLUME = new LSNumKey("PLAYER_VOLUME");
export const PLAYER_REPEAT_MODE = new LSNumKey("PLAYER_REPEAT_MODE");
export const PLAYER_SHUFFLE_MODE = new LSNumKey("PLAYER_SHUFFLE_MODE");

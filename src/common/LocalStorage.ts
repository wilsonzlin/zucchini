import {assert, assertExists} from "common/Sanity";

type Codec<T> = {
  encode: (val: T) => string;
  decode: (raw: string) => T;
}

export const STRING_CODEC = {
  encode: (val: string) => val,
  decode: (raw: string) => raw,
};

export const INTEGER_CODEC = {
  encode: (val: number) => val.toString(),
  decode: (raw: string) => Number.parseInt(raw, 10),
};

export const BOOLEAN_CODEC = {
  encode: (val: boolean) => val ? "1" : "",
  decode: (raw: string) => !!raw,
};

export const JSON_CODEC = {
  encode: (val: any) => JSON.stringify(val),
  decode: (raw: string) => JSON.parse(raw),
};

const DEFAULT_VALIDATOR = (val: any) => true;

const createKeyspace = (prefix: string) => class LSKey<T> {
  constructor (
    private readonly name: string,
    private readonly codec: Codec<T>,
    private readonly validator: (val: T) => boolean = DEFAULT_VALIDATOR,
  ) {
  }

  static createSubkeyspace (additionalPrefix: string) {
    return createKeyspace(`${prefix}${additionalPrefix}`);
  }

  buildKey (): string {
    return `${prefix}${this.name}`;
  }

  getOrDefault (def: T): T {
    try {
      const raw = assertExists(localStorage.getItem(this.buildKey()));
      const val = this.codec.decode(raw);
      assert(this.validator(val));
      return val;
    } catch (err) {
      localStorage.removeItem(this.buildKey());
      return def;
    }
  }

  set (val: T): void {
    assert(this.validator(val));
    const raw = this.codec.encode(val);
    localStorage.setItem(this.buildKey(), raw);
  }
};

const ZucchiniLSKey = createKeyspace("zucchini_");
export const AppLSKey = ZucchiniLSKey.createSubkeyspace("app_");
export const LibrariesLSKey = ZucchiniLSKey.createSubkeyspace("libraries_");
export const PlayerLSKey = ZucchiniLSKey.createSubkeyspace("player_");

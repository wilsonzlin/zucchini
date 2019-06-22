export type SongId = number;
export type OptionalAlbumName = string | null;
export type OptionalArtistName = string | null;
export type ArtistNames = string[];
export type OptionalGenreName = string | null;
export type GenreNames = string[];
export type OptionalTitleName = string | null;
export type OptionalTrackNumber = number | null;
export type OptionalYearNumber = number | null;
export type OptionalDecadeName = string | null;

export const keyFromOptionalField = <T> (fieldName: string, value: T): string => {
  // Use colon prefix for non-null to prevent collision with null.
  return value == null ? "n" : `:${fieldName}:${value}`;
};

export interface Song {
  id: SongId;
  file: string;
  album: OptionalAlbumName;
  artists: ArtistNames;
  genres: GenreNames;
  title: OptionalTitleName;
  track: OptionalTrackNumber;
  year: OptionalYearNumber;
  decade: OptionalDecadeName;
}

const isNotDefinedOrOfType = (obj: object, prop: string, type: "string" | "number" | "boolean") => {
  return obj[prop] == null || typeof obj[prop] == type;
};

const isArrayOfType = (arr: any, type: "string" | "number" | "boolean") => {
  return Array.isArray(arr) && arr.every((val: any) => typeof val == type);
};

export const isWellFormedSong = (obj: any): obj is Song => {
  return obj && typeof obj == "object" &&
    isNotDefinedOrOfType(obj, "album", "string") &&
    isArrayOfType(obj.artists, "string") &&
    isArrayOfType(obj.genres, "string") &&
    isNotDefinedOrOfType(obj, "title", "string") &&
    isNotDefinedOrOfType(obj, "track", "number") &&
    isNotDefinedOrOfType(obj, "year", "number") &&
    isNotDefinedOrOfType(obj, "decade", "string");
};

export enum RepeatMode {
  OFF,
  ONE,
  ALL,
}

export enum ShuffleMode {
  OFF,
  ALL,
}

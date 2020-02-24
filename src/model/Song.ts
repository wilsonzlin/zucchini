import {Comparator, compareArrays, compareIntegers, compareNullableLast, compareProperty, compareStrings, compareUsing} from 'common/Compare';
import {UnreachableError} from 'common/Sanity';
import {isArrayOfType, isNotDefinedOrOfType} from 'common/Type';
import {mapOptional} from 'common/Util';

export type ArtistNames = string[];
export type Duration = number;
export type FileURL = string;
export type GenreNames = string[];
export type OptionalAlbumName = string | null;
export type OptionalArtistName = string | null;
export type OptionalDecadeName = string | null;
export type OptionalGenreName = string | null;
export type OptionalTitleName = string | null;
export type OptionalTrackNumber = number | null;
export type OptionalYearNumber = number | null;
// The type of value that a non-array field's value could be,
// or the element type for an array field. Update this when
// above types change.
export type FieldUnitValue = string | number;

export interface ISong {
  album: OptionalAlbumName;
  artists: ArtistNames;
  decade: OptionalDecadeName;
  duration: Duration;
  file: FileURL;
  genres: GenreNames;
  title: OptionalTitleName;
  track: OptionalTrackNumber;
  year: OptionalYearNumber;
}

export const isWellFormedSong = (obj: any): obj is ISong => {
  return obj && typeof obj == 'object' &&
    isArrayOfType(obj.artists, 'string') &&
    isArrayOfType(obj.genres, 'string') &&
    isNotDefinedOrOfType(obj, 'album', 'string') &&
    isNotDefinedOrOfType(obj, 'decade', 'string') &&
    isNotDefinedOrOfType(obj, 'duration', 'number') &&
    isNotDefinedOrOfType(obj, 'file', 'string') &&
    isNotDefinedOrOfType(obj, 'title', 'string') &&
    isNotDefinedOrOfType(obj, 'track', 'number') &&
    isNotDefinedOrOfType(obj, 'year', 'number');
};

export type Field = keyof ISong;

/*
 * These are defined here so that changes to the song structure/format can be
 * reflected in other parts of the app, such as searching, filtering, and grouping.
 */

// Don't have both year and decade.
export const TEXT_SEARCH_FIELDS: Field[] = ['album', 'artists', 'genres', 'title', 'decade'];

export const FILTERABLE_FIELDS: Field[] = ['album', 'artists', 'decade', 'genres'];
export const GROUPABLE_FIELDS: Field[] = ['album', 'artists', 'decade', 'genres', 'title'];
export const SUBGROUPABLE_FIELDS: Field[] = ['album', 'artists', 'decade', 'genres', 'title'];

export const ARRAY_FIELDS: Field[] = ['artists', 'genres'];
export const NUMERIC_FIELDS: Field[] = ['track', 'year'];
/**
 * Return an array of a song's values for a field. If the field is not an array of values,
 * return an array of zero elements if the value is null, or one element representing the value.
 * @param song song to get values from
 * @param field field to get values of
 */
export const getFieldValues = <F extends Field> (song: ISong, field: F): FieldUnitValue[] => {
  return ARRAY_FIELDS.includes(field)
    ? song[field] as FieldUnitValue[]
    : mapOptional(song[field], v => [v], []) as FieldUnitValue[];
};

const FIELD_COMPARATORS: { [field in Field]: Comparator<ISong> } = {
  file () {
    throw new UnreachableError('Attempted to compare song file URLs');
  },
  duration: compareProperty('duration', compareIntegers),
  album: compareProperty('album', compareNullableLast(compareStrings)),
  artists: compareProperty('artists', compareArrays(compareStrings)),
  decade: compareProperty('decade', compareNullableLast(compareStrings)),
  genres: compareProperty('genres', compareArrays(compareStrings)),
  title: compareProperty('title', compareNullableLast(compareStrings)),
  track: compareProperty('track', compareNullableLast(compareIntegers)),
  year: compareProperty('year', compareNullableLast(compareIntegers)),
};

/*
 The comparator to use when ordering songs, depending on:
   1. what the subgroup is; or if not available, then
   2. what the group is; or if not available, then
   3. what the filter is.
 The ordering for a plain ungrouped listing is the comparator with key `undefined`.

 Reasons:
   - If the user wanted to see artists together, they would group by artist.
   - Albums can contain tracks from multiple artists, but it makes more
     sense to sort by track.
   - A user is more likely to *explore* albums and *search* for artists,
     so sorting by album makes more sense than artist.
*/
const compareUsingFields = (...fields: Field[]) => compareUsing(...fields.map(f => FIELD_COMPARATORS[f]));

export const SONG_COMPARATOR = new Map<Field | undefined, Comparator<ISong>>();
SONG_COMPARATOR.set('album', compareUsingFields('track', 'title'));
SONG_COMPARATOR.set('artists', compareUsingFields('album', 'track', 'title'));
SONG_COMPARATOR.set('decade', compareUsingFields('album', 'track', 'title'));
SONG_COMPARATOR.set('genres', compareUsingFields('album', 'track', 'title'));
SONG_COMPARATOR.set('title', compareUsingFields('title', 'artists', 'album'));
SONG_COMPARATOR.set(undefined, compareUsingFields('album', 'track', 'title'));

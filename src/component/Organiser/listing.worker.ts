import {assertExists, UnreachableError} from 'common/Sanity';
import {WorkerRequests, workerServer} from 'common/Worker';
import {Listing} from 'component/Organiser/state';
import {
  ARRAY_FIELDS,
  ArtistNames,
  Field,
  FieldUnitValue,
  GenreNames,
  NUMERIC_FIELDS,
  OptionalAlbumName,
  OptionalDecadeName,
  OptionalTitleName,
  ISong,
  SONG_COMPARATOR,
} from 'model/Song';

const getGroups = <F extends Field> (field: F, value: ISong[F]): (string | null)[] => {
  switch (field) {
  case 'album':
    return [value as OptionalAlbumName];
  case 'artists':
    return value as ArtistNames;
  case 'genres':
    return value as GenreNames;
  case 'title':
    return [((value as OptionalTitleName) || '')[0] || null];
  case 'decade':
    return [value as OptionalDecadeName];
  default:
    // Should not be able to group by any other field.
    throw new UnreachableError();
  }
};

const grouped = (songs: ISong[], field: Field): { group: string; songs: ISong[] }[] => {
  const isNumberField = NUMERIC_FIELDS.includes(field);
  const grouped: { [group: string]: ISong[] } = {};
  for (const song of songs) {
    for (const g of getGroups(field, song[field])) {
      if (g == null) {
        continue;
      }
      if (!grouped[g]) {
        grouped[g] = [];
      }
      grouped[g].push(song);
    }
  }
  return Object.keys(grouped)
    .sort(isNumberField ? (a, b) => +a - +b : (a, b) => a.localeCompare(b))
    .map(g => ({group: g, songs: grouped[g]}));
};

export interface ListingWorkerRequests extends WorkerRequests {
  getListing: {
    request: {
      songs: ISong[],
      filter?: { field: Field; match: string };
      group?: { field: Field; subgroup?: Field };
    };
    response: Listing;
  };
}

workerServer<ListingWorkerRequests>({
  getListing: ({songs, filter, group}) => {
    const filteredSongs = !filter ? songs.slice() :
      ARRAY_FIELDS.includes(filter.field) ?
        songs.filter(s => (s[filter.field] as FieldUnitValue[]).includes(filter.match)) :
        songs.filter(s => s[filter.field] === filter.match);

    const count = filteredSongs.length;
    const duration = filteredSongs.reduce((sum, s) => sum + s.duration, 0);

    const ordering = assertExists(SONG_COMPARATOR.get(group
      ? (group.subgroup || group.field)
      : filter
        ? filter.field
        : undefined,
    ));

    if (!group) {
      return {
        groups: [{subgroups: [{songs: filteredSongs.sort(ordering)}]}],
        count, duration,
      };
    } else if (!group.subgroup) {
      return {
        groups: grouped(filteredSongs, group.field).map(g => ({
          field: group.field,
          name: g.group,
          subgroups: [{
            songs: g.songs.sort(ordering),
          }],
        })),
        count, duration,
      };
    } else {
      const {field, subgroup} = group;
      return {
        groups: grouped(filteredSongs, field).map(g => ({
          field: field,
          name: g.group,
          subgroups: grouped(g.songs, subgroup).map(sg => ({
            name: sg.group,
            field: subgroup,
            songs: sg.songs.sort(ordering),
          })),
        })),
        count, duration,
      };
    }
  },
});

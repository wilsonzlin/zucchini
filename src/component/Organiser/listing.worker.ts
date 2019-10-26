import {UnreachableError} from "common/Sanity";
import {WorkerRequests, workerServer} from "common/Worker";
import {Listing} from "component/Organiser/state";
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
  Song,
  SONG_COMPARATOR
} from "model/Song";

const getGroups = <F extends Field> (field: F, value: Song[F]): (string | null)[] => {
  switch (field) {
  case "album":
    return [value as OptionalAlbumName];
  case "artists":
    return value as ArtistNames;
  case "genres":
    return value as GenreNames;
  case "title":
    return [((value as OptionalTitleName) || "")[0] || null];
  case "decade":
    return [value as OptionalDecadeName];
  default:
    // Should not be able to group by any other field.
    throw new UnreachableError();
  }
};

const grouped = (songs: Song[], field: Field): { group: string; songs: Song[] }[] => {
  const isNumberField = NUMERIC_FIELDS.includes(field);
  const grouped: { [group: string]: Song[] } = {};
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
      songs: Song[],
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

    const ordering = SONG_COMPARATOR.get(group
      ? (group.subgroup || group.field)
      : filter
        ? filter.field
        : undefined
    )!;

    if (!group) {
      return {
        type: "single",
        count, duration,
        units: filteredSongs.sort(ordering),
      };
    } else if (!group.subgroup) {
      return {
        type: "grouped",
        count, duration,
        units: grouped(filteredSongs, group.field).map(g => ({
          name: g.group,
          field: group.field,
          songs: g.songs.sort(ordering),
        })),
      };
    } else {
      const {field, subgroup} = group;
      return {
        type: "subgrouped",
        count, duration,
        units: grouped(filteredSongs, field).map(g => ({
          name: g.group,
          field: field,
          subgroups: grouped(g.songs, subgroup).map(sg => ({
            name: sg.group,
            field: subgroup,
            songs: sg.songs.sort(ordering),
          })),
        })),
      };
    }
  },
});

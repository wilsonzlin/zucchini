import {createCreateActionFunction, createReducer} from "../common/Action";
import {
  ArtistNames,
  GenreNames,
  OptionalAlbumName,
  OptionalArtistName,
  OptionalDecadeName,
  OptionalGenreName,
  OptionalYearNumber,
  Song
} from "../common/Media";
import {compareNullable, compareProperties, concatThenDeduplicate, JMap, undefinedFallback} from "../common/Util";
import {searchEngine} from "../system/SearchEngine";

interface LibraryAlbumState {
  album: OptionalAlbumName;
  genres: GenreNames;
  year: OptionalYearNumber;
  featuring: ArtistNames;
  tracks: Song[];
}

interface LibraryArtistState {
  artist: OptionalArtistName;
  albums: LibraryAlbumState[]
}

export interface LibraryState {
  searchTerm: string;
  filteredSongIds: number[] | null;

  songs: Song[];
  byArtist: LibraryArtistState[];

  artists: OptionalArtistName[];
  genres: OptionalGenreName[];
  albums: OptionalAlbumName[];
  decades: OptionalDecadeName[];
}

export interface LibraryActions {
  UPDATE_SEARCH_TERM: {
    searchTerm: string;
  };
  UPDATE_SONGS: {
    songs: Song[];
  };
}

export const libraryAction = createCreateActionFunction<LibraryActions>();

export const LibraryReducer = createReducer<LibraryState, LibraryActions>({
  searchTerm: "",
  filteredSongIds: null,

  songs: [],
  byArtist: [],
  artists: [],
  genres: [],
  albums: [],
  decades: [],
}, {
  UPDATE_SEARCH_TERM: (state, action) => {
    // action.searchTerm is what the user types, queryTerm is what is actually used to search.
    // The input must still show action.searchTerm, not the trimmed version, as otherwise it's
    // not possible to type spaces.
    const queryTerm = action.searchTerm.trim();

    const filteredSongIds = !queryTerm ? null : searchEngine.search(queryTerm);

    return {
      ...state,
      searchTerm: action.searchTerm,
      filteredSongIds: filteredSongIds,
    };
  },
  UPDATE_SONGS: (state, action) => {
    // Artist -> album -> AlbumProps.
    const hierarchy = new JMap<OptionalArtistName, JMap<OptionalAlbumName, LibraryAlbumState>>();

    // Prepare to rebuild search index.
    searchEngine.clear();

    const artists: Set<OptionalArtistName> = new Set();
    const genres: Set<OptionalGenreName> = new Set();
    const albums: Set<OptionalAlbumName> = new Set();
    const decades: Set<OptionalDecadeName> = new Set();

    // WARNING: Make sure objects created match state type definitions!
    for (const song of action.songs) {
      // Restructure song to fit state i.e. artist -> album -> track.
      const album = hierarchy
        .computeIfAbsent(
          undefinedFallback<OptionalArtistName>(song.artists[0], null),
          _ => new JMap()
        )
        .computeIfAbsent(
          song.album,
          _ => ({
            album: song.album,
            genres: [],
            year: song.year,
            featuring: song.artists.slice(1),
            tracks: [],
          })
        );
      album.genres = concatThenDeduplicate(album.genres, song.genres);
      album.tracks.push(song);

      // Add metadata to category values.
      song.artists.forEach(a => artists.add(a));
      song.genres.forEach(g => genres.add(g));
      song.album != null && albums.add(song.album);
      song.decade != null && decades.add(song.decade);

      // Add to search engine.
      // NOTE: When joining, undefined and null elements are represented as empty strings, which is what we want.
      searchEngine.add(song.id, [
        song.album,
        ...song.artists,
        song.decade,
        ...song.genres,
        song.title,
      ].join(" "));
    }

    const library: LibraryArtistState[] = [...hierarchy.keys()]
      .sort(compareNullable())
      .map(artistName => ({
        artist: artistName,
        albums: [...hierarchy.get(artistName)!.values()]
          .sort(compareProperties("album", compareNullable())),
      }));

    return {
      ...state,
      songs: action.songs,
      byArtist: library,

      // TODO Maybe show null entries?
      artists: [...artists].sort(),
      genres: [...genres].sort(),
      albums: [...albums].sort(),
      decades: [...decades].sort(),
    };
  },
});

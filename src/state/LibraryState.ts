import {createCreateActionFunction, createReducer, GlobalDispatcher} from "../common/Action";
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
import {compareNullable, compareProperties, concatThenDeduplicate, undefinedFallback} from "../common/Util";
import {textSearchEngine} from "../system/TextSearchEngine";
import {queryEngine} from "../system/QueryEngine";
import {ISearchEngine} from "../system/ISearchEngine";
import {JMap} from "../common/JMap";
import {TextSearchEngineAutocomplete} from "../system/TextSearchEngineField";

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
  searchLoading: boolean;
  searchError: string;
  searchSuggestions: TextSearchEngineAutocomplete[];
  filteredSongIds: string[] | null;

  songs: Song[];
  byArtist: LibraryArtistState[];

  artists: OptionalArtistName[];
  genres: OptionalGenreName[];
  albums: OptionalAlbumName[];
  decades: OptionalDecadeName[];
}

export interface LibraryActions {
  UPDATE_SEARCH_TERM: {
    term: string;
  };
  UPDATE_SEARCH_LOADING: {
    loading: boolean;
  };
  UPDATE_SEARCH_ERROR: {
    error: string;
  };
  UPDATE_SEARCH_SUGGESTIONS: {
    suggestions: TextSearchEngineAutocomplete[];
  };
  UPDATE_SEARCH_RESULTS: {
    filteredIds: string[] | null;
  };
  UPDATE_SONGS: {
    songs: Song[];
  };
}

export const libraryAction = createCreateActionFunction<LibraryActions>();

export const librarySearchThunk = (action: { term: string }) =>
  (dispatch: GlobalDispatcher) => {
    dispatch(libraryAction("UPDATE_SEARCH_TERM", {term: action.term}));
    dispatch(libraryAction("UPDATE_SEARCH_LOADING", {loading: false}));
    dispatch(libraryAction("UPDATE_SEARCH_SUGGESTIONS", {suggestions: []}));
    // action.searchTerm is what the user types, queryTerm is what is actually used to search.
    // The input must still show action.searchTerm, not the trimmed version, as otherwise it's
    // not possible to type spaces.
    let queryTerm = action.term.trim();

    if (!queryTerm) {
      dispatch(libraryAction("UPDATE_SEARCH_RESULTS", {filteredIds: null}));
      dispatch(libraryAction("UPDATE_SEARCH_ERROR", {error: ""}));
      return;
    }

    dispatch(libraryAction("UPDATE_SEARCH_LOADING", {loading: true}));

    const engine: ISearchEngine = {
      ";": queryEngine,
    }[queryTerm[0]] || textSearchEngine;

    if (engine == textSearchEngine) {
      dispatch(libraryAction("UPDATE_SEARCH_SUGGESTIONS", {
        suggestions: textSearchEngine.autocomplete(queryTerm),
      }));
    } else {
      queryTerm = queryTerm.slice(1);
    }

    engine.search(queryTerm)
      .then(result => {
        dispatch(libraryAction("UPDATE_SEARCH_RESULTS", {filteredIds: result}));
        dispatch(libraryAction("UPDATE_SEARCH_ERROR", {error: ""}));
      })
      .catch(err => {
        dispatch(libraryAction("UPDATE_SEARCH_ERROR", {error: err.message}));
      })
      .then(() => dispatch(libraryAction("UPDATE_SEARCH_LOADING", {loading: false})));
  };

export const LibraryReducer = createReducer<LibraryState, LibraryActions>({
  searchTerm: "",
  searchLoading: false,
  searchError: "",
  searchSuggestions: [],
  filteredSongIds: null,

  songs: [],
  byArtist: [],
  artists: [],
  genres: [],
  albums: [],
  decades: [],
}, {
  UPDATE_SEARCH_TERM: (state, action) => {
    return {
      ...state,
      searchTerm: action.term,
    };
  },
  UPDATE_SEARCH_LOADING: (state, action) => {
    return {
      ...state,
      searchLoading: action.loading,
    };
  },
  UPDATE_SEARCH_ERROR: (state, action) => {
    return {
      ...state,
      searchError: action.error,
    };
  },
  UPDATE_SEARCH_SUGGESTIONS: (state, action) => {
    return {
      ...state,
      searchSuggestions: action.suggestions,
    };
  },
  UPDATE_SEARCH_RESULTS: (state, action) => {
    return {
      ...state,
      filteredSongIds: action.filteredIds,
    };
  },
  UPDATE_SONGS: (state, action) => {
    // Artist -> album -> AlbumProps.
    const hierarchy = new JMap<OptionalArtistName, JMap<OptionalAlbumName, LibraryAlbumState>>();

    // Add songs to search engine.
    textSearchEngine.loadData(action.songs);

    // Send songs to worker to allow querying.
    queryEngine.loadData(action.songs);

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

import {SearchEngine} from "component/Search/state";
import {getFieldValues, Song, TEXT_SEARCH_FIELDS} from "model/Song";
// TODO flexsearch types
// @ts-ignore
import flexsearch = require("flexsearch");

export const createSearchEngine = async (songs: Song[]): Promise<SearchEngine> => {
  const searchEngine = new flexsearch({
    async: true,
  });
  const autocompleteEngine = new flexsearch({
    suggest: true,
  });
  const songsByFile = new Map<string, Song>();

  const seenAutocomplete = new Set<string>();

  for (const song of songs) {
    songsByFile.set(song.file, song);
    searchEngine.add(
      song.file,
      TEXT_SEARCH_FIELDS
        .map(f => `${song[f] == null ? "" : song[f]}`)
        .reduce((arr, v) => arr.concat(v), [] as string[])
        .join(" ")
    );

    for (const field of TEXT_SEARCH_FIELDS) {
      for (const value of getFieldValues(song, field).map(v => v.toString())) {
        if (!seenAutocomplete.has(value)) {
          seenAutocomplete.add(value);
          autocompleteEngine.add(value, value);
        }
      }
    }
  }

  return {
    searchAllFields: query => searchEngine.search(query)
      .then((res: string[]) => res.map(file => songsByFile.get(file))),
    searchField: (field, query) => {
      // TODO
      throw new Error();
    },
    suggestAllFields: (query, limit) => autocompleteEngine.search(query, {limit}),
    suggestField: (field, query, limit) => {
      // TODO
      throw new Error();
    }
  };
};

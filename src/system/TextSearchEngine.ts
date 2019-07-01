// TODO flexsearch types
// @ts-ignore
import flexsearch = require("flexsearch");
import {ISearchEngine} from "./ISearchEngine";
import {Song} from "../common/Media";
import {
  textSearchAutocompleteFromKey,
  textSearchAutocompleteToKey,
  TextSearchEngineAutocomplete,
  textSearchEngineFields
} from "./TextSearchEngineField";

export const textSearchEngine = new class implements ISearchEngine {
  private readonly searchEngine: any;
  private readonly autocompeteEngine: any;

  constructor () {
    this.searchEngine = new flexsearch({
      async: true,
    });
    this.autocompeteEngine = new flexsearch({
      suggest: true,
    });
  }

  // TODO Bind to store.
  loadData (songs: Song[]): void {
    // TODO Comment
    this.searchEngine.clear();

    const seenAutocomplete = new Set<string>();

    for (const song of songs) {
      this.searchEngine.add(
        song.file,
        textSearchEngineFields
          .map(f => `${song[f] == null ? "" : song[f]}`)
          .reduce((arr, v) => arr.concat(v), [] as string[])
          .join(" ")
      );

      for (const field of textSearchEngineFields) {
        // TODO Refactor
        if (song[field] == null) {
          continue;
        }

        const fieldValues = Array.isArray(song[field]) ?
          song[field] as any[] :
          [song[field]];

        for (const value of fieldValues) {
          const key = textSearchAutocompleteToKey({
            field: field,
            value: `${value}`,
          });
          if (!seenAutocomplete.has(key)) {
            seenAutocomplete.add(key);
            this.autocompeteEngine.add(key, value);
          }
        }
      }
    }
  }

  autocomplete (term: string): TextSearchEngineAutocomplete[] {
    return this.autocompeteEngine.search(term, {
      limit: 5,
    })
      .map((key: string) => textSearchAutocompleteFromKey(key));
  }

  async search (query: string): Promise<string[]> {
    return await this.searchEngine.search(query);
  }
};

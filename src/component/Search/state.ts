import {computed, observable} from "mobx";
import {fromPromise, IPromiseBasedObservable} from "mobx-utils";
import {Field, Song} from "model/Song";

export interface SearchEngine {
  searchAllFields (query: string): Promise<Song[]>;

  searchField (field: Field, query: string): Promise<Song[]>;

  suggestAllFields (query: string, limit: number): Promise<string[]>;

  suggestField (field: Field, query: string, limit: number): Promise<string[]>;
}

export const enum SearchType {
  FILTER,
  QUERY,
  TEXT,
}

export class SearchStore {
  constructor (
    private readonly searchEngineFactory: (songs: Song[]) => Promise<SearchEngine>,
    private readonly getSongs: () => IPromiseBasedObservable<Song[]> | undefined,
  ) {
  }

  @computed
  private get songs () {
    return this.getSongs();
  }

  @observable searchType: SearchType = SearchType.TEXT;
  @observable searchTerm: string = "";

  @computed get searchEngine (): IPromiseBasedObservable<SearchEngine> | undefined {
    return this.songs && fromPromise(
      this.songs.then<SearchEngine>(songs => this.searchEngineFactory(songs))
    );
  }

  @computed get searchSuggestions (): IPromiseBasedObservable<string[]> | undefined {
    return !this.searchTerm || this.searchType != SearchType.TEXT || !this.searchEngine
      ? undefined
      : fromPromise(this.searchEngine.then<string[]>(engine => engine.suggestAllFields(this.searchTerm, 5)));
  }

  @computed get filteredSongs (): IPromiseBasedObservable<Song[]> | undefined {
    const term = this.searchTerm.trim();
    if (!term || !this.searchEngine) {
      return this.songs;
    }

    return fromPromise(this.searchEngine.then<Song[]>(engine => engine.searchAllFields(this.searchTerm)));
  }
}

export class SearchState {
  constructor (
    private readonly store: SearchStore,
  ) {
  }

  getFilteredSongs = () => {
    return this.store.filteredSongs;
  };
}

import {computed, observable} from "mobx";
import {fromPromise, IPromiseBasedObservable} from "mobx-utils";
import {Field, ISong} from "model/Song";

export interface SearchEngine {
  searchAllFields (query: string): Promise<ISong[]>;

  searchField (field: Field, query: string): Promise<ISong[]>;

  suggestAllFields (query: string, limit: number): Promise<string[]>;

  suggestField (field: Field, query: string, limit: number): Promise<string[]>;
}

export class SearchStore {
  constructor (
    private readonly searchEngineFactory: (songs: ISong[]) => Promise<SearchEngine>,
    private readonly getSongs: () => IPromiseBasedObservable<ISong[]> | undefined,
  ) {
  }

  @computed
  private get songs () {
    return this.getSongs();
  }

  @observable unconfirmedSearchTerm: string = "";
  @observable confirmedSearchTerm: string = "";

  @computed get searchEngine (): IPromiseBasedObservable<SearchEngine> | undefined {
    return this.songs && fromPromise(
      this.songs.then<SearchEngine>(songs => this.searchEngineFactory(songs))
    );
  }

  @computed get searchSuggestions (): IPromiseBasedObservable<string[]> | undefined {
    return !this.unconfirmedSearchTerm || !this.searchEngine
      ? undefined
      : fromPromise(this.searchEngine.then<string[]>(engine => engine.suggestAllFields(this.unconfirmedSearchTerm, 5)));
  }

  @computed get filteredSongs (): IPromiseBasedObservable<ISong[]> | undefined {
    const term = this.confirmedSearchTerm.trim();
    if (!term || !this.searchEngine) {
      return this.songs;
    }

    return fromPromise(this.searchEngine.then<ISong[]>(engine => engine.searchAllFields(this.confirmedSearchTerm)));
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

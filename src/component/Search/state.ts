import {computed, observable} from 'mobx';
import {fromPromise, IPromiseBasedObservable} from 'mobx-utils';

export class SearchStore {
  @observable unconfirmedSearchTerm: string = '';
  @observable confirmedSearchTerm: string = '';

  constructor (
    private readonly suggester: (query: string) => Promise<string[]>,
  ) {
  }

  @computed get searchSuggestions (): IPromiseBasedObservable<string[]> | undefined {
    return !this.unconfirmedSearchTerm
      ? undefined
      : fromPromise(this.suggester(this.unconfirmedSearchTerm));
  }
}

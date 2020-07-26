import {computed, observable} from 'mobx';
import {fromPromise, IPromiseBasedObservable} from 'mobx-utils';
import {SearchAutocompleteApi} from 'service/CollectionService';

export class SearchStore {
  @observable unconfirmedSearchTerm: string = '';
  @observable confirmedSearchTerm: string = '';

  constructor (
    private readonly suggester: SearchAutocompleteApi,
  ) {
  }

  @computed get searchSuggestions (): IPromiseBasedObservable<string[]> | undefined {
    return !this.unconfirmedSearchTerm
      ? undefined
      : fromPromise(this.suggester({query: this.unconfirmedSearchTerm}).then(r => r.expansions));
  }
}

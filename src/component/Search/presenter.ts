import {SearchStore} from 'component/Search/state';
import {action} from 'mobx';

export class SearchPresenter {
  constructor (
    private readonly store: SearchStore,
  ) {
  }

  @action
  updateSearchTerm = (term: string) => {
    this.store.unconfirmedSearchTerm = term;
  };

  @action
  confirmSearchTerm = () => {
    this.store.confirmedSearchTerm = this.store.unconfirmedSearchTerm;
  };

  @action
  updateAndConfirmSearchTerm = (term: string) => {
    this.store.confirmedSearchTerm = this.store.unconfirmedSearchTerm = term;
  };
}

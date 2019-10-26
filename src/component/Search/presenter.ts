import {SearchStore} from "component/Search/state";
import {action} from "mobx";

export class SearchPresenter {
  constructor (
    private readonly store: SearchStore,
  ) {
  }

  @action
  updateSearchTerm = (term: string) => {
    this.store.searchTerm = term;
  };
}

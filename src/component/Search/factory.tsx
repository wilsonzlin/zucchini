import {watchPromise} from "common/Async";
import {createSearchEngine} from "component/Search/config";
import {SearchPresenter} from "component/Search/presenter";
import {SearchState, SearchStore} from "component/Search/state";
import {Search as SearchImpl} from "component/Search/view";
import {observer} from "mobx-react";
import {IPromiseBasedObservable} from "mobx-utils";
import {ISong} from "model/Song";
import * as React from "react";

export interface SearchDependencies {
  getSongs: () => IPromiseBasedObservable<ISong[]> | undefined;
}

export const SearchFactory = (
  {
    getSongs,
  }: SearchDependencies
) => {
  const store = new SearchStore(createSearchEngine, getSongs);
  const presenter = new SearchPresenter(store);

  const Search = observer(() =>
    <SearchImpl
      unconfirmedTerm={store.unconfirmedSearchTerm}
      confirmedTerm={store.confirmedSearchTerm}
      suggestions={watchPromise(store.searchSuggestions)}
      status={watchPromise(store.filteredSongs)}

      onSearchInput={presenter.updateSearchTerm}
      onSearch={presenter.confirmSearchTerm}
      onSelectSuggestion={presenter.updateAndConfirmSearchTerm}
    />
  );

  return {
    Search,
    searchState: new SearchState(store),
  };
};

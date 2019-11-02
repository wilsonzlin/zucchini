import {watchPromise} from "common/Async";
import {createSearchEngine} from "component/Search/config";
import {SearchPresenter} from "component/Search/presenter";
import {SearchState, SearchStore} from "component/Search/state";
import {Search as SearchImpl} from "component/Search/view";
import {observer} from "mobx-react";
import {IPromiseBasedObservable} from "mobx-utils";
import {Song} from "model/Song";
import * as React from "react";

export interface SearchDependencies {
  getSongs: () => IPromiseBasedObservable<Song[]> | undefined;
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
      type={store.searchType}
      term={store.searchTerm}
      suggestions={watchPromise(store.searchSuggestions)}
      status={watchPromise(store.filteredSongs)}

      onSearch={presenter.updateSearchTerm}
      onSelectSuggestion={presenter.updateSearchTerm}
    />
  );

  return {
    Search,
    searchState: new SearchState(store),
  };
};

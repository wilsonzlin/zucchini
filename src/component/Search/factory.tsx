import {watchPromise} from 'common/Async';
import {SearchPresenter} from 'component/Search/presenter';
import {SearchStore} from 'component/Search/state';
import {Search as SearchImpl} from 'component/Search/view';
import {observer} from 'mobx-react';
import React from 'react';
import {SearchAutocompleteApi} from 'service/CollectionService';

export const SearchFactory = ({
  dependencies: {
    suggester,
  },
}: {
  dependencies: {
    suggester: SearchAutocompleteApi;
  };
  universe: {
  };
  eventHandlers: {
  };
}) => {
  const store = new SearchStore(suggester);
  const presenter = new SearchPresenter(store);

  const Search = observer(() =>
    <SearchImpl
      unconfirmedTerm={store.unconfirmedSearchTerm}
      confirmedTerm={store.confirmedSearchTerm}
      suggestions={watchPromise(store.searchSuggestions)}

      onSearchInput={presenter.updateSearchTerm}
      onSearch={presenter.confirmSearchTerm}
      onSelectSuggestion={presenter.updateAndConfirmSearchTerm}
    />,
  );

  return {
    views: {
      Search,
    },
    state: {
      query: () => store.confirmedSearchTerm,
    },
    actions: {},
    disposers: [],
  };
};

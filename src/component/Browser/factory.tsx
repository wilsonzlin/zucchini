import {EventHandler} from 'common/Event';
import {reaction} from 'mobx';
import {observer} from 'mobx-react';
import {File} from 'model/Listing';
import React from 'react';
import {ListApi} from 'service/CollectionService';
import {BrowserPresenter} from './presenter';
import {BrowserStore} from './state';
import {Browser as BrowserImpl} from './view';

export const BrowserFactory = ({
  dependencies: {
    listFetcher,
    Search,
  },
  universe,
  eventHandlers: {
    onRequestPlayFiles,
  },
}: {
  dependencies: {
    listFetcher: ListApi;
    Search: () => JSX.Element;
  };
  universe: {
    searchQuery: () => string | undefined;
  };
  eventHandlers: {
    onRequestPlayFiles: EventHandler<[File[], File]>;
  };
}) => {
  const store = new BrowserStore();
  const presenter = new BrowserPresenter(store, universe.searchQuery, listFetcher);
  const disposers = [];

  disposers.push(reaction(
    () => universe.searchQuery(),
    () => presenter.newListFetch(),
  ));
  presenter.newListFetch();

  const Browser = observer(() => (
    <BrowserImpl
      approximateCount={store.approximateCount}
      approximateDuration={store.approximateDuration}
      approximateSize={store.approximateSize}
      currentPath={store.currentPath}
      entries={store.entries}
      error={store.error}
      hasContinuation={store.continuation != undefined}
      loading={store.loading}
      onJumpToFolder={presenter.setCurrentPath}
      onOpenFolder={presenter.goToSubfolder}
      onRequestPlayFiles={onRequestPlayFiles}
      Search={Search}
      viewMode={store.viewMode}
    />
  ));

  return {
    views: {
      Browser,
    },
    state: {},
    actions: {},
    disposers,
  };
};

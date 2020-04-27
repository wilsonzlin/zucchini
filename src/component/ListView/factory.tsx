import {List as ListImpl} from 'component/ListView/view';
import {reaction} from 'mobx';
import * as mobxReact from 'mobx-react';
import React from 'react';
import {EventHandler} from '../../common/Event';
import {MediaFile, MediaFileType} from '../../model/Media';
import {GroupDelimiter} from '../../model/Playlist';
import {Columns} from './config';
import {ListViewPresenter} from './presenter';
import {ListViewStore} from './state';

export const ListViewFactory = ({
  dependencies: {
    listFetcher,
  },
  universe,
  eventHandlers: {
    onRequestPlayFiles,
  },
}: {
  dependencies: {
    listFetcher: (req: {
      source: { path: string[]; subdirectories: boolean; };
      filter?: string;
      groupBy?: string[]
      sortBy?: string[],
      types: MediaFileType[];
      continuation?: string;
    }) => Promise<{
      results: (GroupDelimiter | MediaFile)[];
      approximateSize?: number;
      approximateDuration?: number;
      approximateCount?: number;
      continuation?: string;
    }>;
  };
  universe: {
    searchQuery: () => string | undefined;
  };
  eventHandlers: {
    onRequestPlayFiles: EventHandler<MediaFile[]>;
  };
}) => {
  const store = new ListViewStore();
  const presenter = new ListViewPresenter(store, universe.searchQuery, listFetcher);
  const disposers = [];

  disposers.push(reaction(
    () => universe.searchQuery(),
    () => presenter.newListFetch(),
  ));
  presenter.newListFetch();

  const List = mobxReact.observer(() =>
    <ListImpl
      columns={Columns}
      entries={store.entries}
      loading={store.loading}
      error={store.error}
      approximateCount={store.approximateCount}
      approximateDuration={store.approximateDuration}
      approximateSize={store.approximateSize}
      hasContinuation={store.continuation !== undefined}

      onRequestPlayFiles={onRequestPlayFiles}
    />,
  );

  return {
    views: {
      List,
    },
    state: {},
    actions: {},
    disposers,
  };
};

import {EventHandler} from 'common/Event';
import {observer} from 'mobx-react';
import {File, Listing} from 'model/Listing';
import React from 'react';
import {GetCustomPlaylistsApi, ListApi} from 'service/CollectionService';
import {viewport, ViewportMode} from 'system/Viewport';
import {PlaylistPresenter} from './presenter';
import {PlaylistStore, UiPlaylistId} from './state';
import {PlaylistView, PlaylistViewMode} from './view';

export const PlaylistFactory = ({
  dependencies: {
    initialPlaylist,
    playlistsFetcher,
    playlistEntriesFetcher,
  },
  universe,
  eventHandlers: {
    onRequestPlay,
  },
}: {
  universe: {
    currentFile: () => File | undefined;
    localPlaylists: () => { id: symbol, name: string; entries: Listing[] }[];
  };
  dependencies: {
    initialPlaylist: UiPlaylistId;
    playlistsFetcher: GetCustomPlaylistsApi;
    playlistEntriesFetcher: ListApi;
  };
  eventHandlers: {
    onRequestPlay: EventHandler<File>;
  };
}) => {
  const store = new PlaylistStore(universe.currentFile, universe.localPlaylists);
  const presenter = new PlaylistPresenter(store, universe.localPlaylists, playlistsFetcher, playlistEntriesFetcher);
  presenter.fetchCustomPlaylists();
  presenter.switchPlaylist(initialPlaylist);

  const Playlist = observer(() => (
    <PlaylistView
      mode={viewport.mode == ViewportMode.SMALL && !store.expanded ? PlaylistViewMode.BAR : PlaylistViewMode.PANEL}
      expanded={viewport.mode == ViewportMode.SMALL && store.expanded}
      onRequestExpand={presenter.expand}
      onRequestCollapse={presenter.collapse}

      playlists={store.playlists}
      id={store.id}
      name={store.name}
      loading={store.loading}
      error={store.error}
      entries={store.entries.slice()}
      currentFile={universe.currentFile()}

      repeatMode={store.repeatMode}
      shuffleMode={store.shuffleMode}

      onChangePlaylist={presenter.switchPlaylist}
      onToggleRepeat={presenter.updateRepeatMode}
      onToggleShuffle={presenter.updateShuffleMode}
      onPlay={onRequestPlay}
    />
  ));

  return {
    views: {
      Playlist,
    },
    actions: {},
    state: {
      nextFile: () => store.nextFile,
      nextFileWrapped: () => store.nextFileWrapped,
      previousFile: () => store.previousFile,
      previousFileWrapped: () => store.previousFileWrapped,
      repeatMode: () => store.repeatMode,
    },
    disposers: [],
  };
};

import {observer} from 'mobx-react';
import React from 'react';
import {watchPromise} from '../../common/Async';
import {EventHandler} from '../../common/Event';
import {MediaFile, MediaFileType} from '../../model/Media';
import {GroupDelimiter, SpecialPlaylist} from '../../model/Playlist';
import {viewport, ViewportMode} from '../../system/Viewport';
import {PlaylistPresenter} from './presenter';
import {PlaylistStore} from './state';
import {PlaylistView, PlaylistViewMode} from './view';

export const PlaylistFactory = ({
  dependencies: {
    playlistsFetcher,
    playlistEntriesFetcher,
  },
  universe,
  eventHandlers: {
    onRequestPlay,
  },
}: {
  universe: {
    currentFile: () => MediaFile | undefined;
    localPlaylists: () => { id: symbol, name: string; entries: MediaFile[] }[];
  };
  dependencies: {
    playlistsFetcher: () => Promise<{ id: SpecialPlaylist | string; name: string; modifiable: boolean; }[]>;
    playlistEntriesFetcher: (req: { playlistId: SpecialPlaylist | string; types: MediaFileType[]; filter?: string; continuation?: string; }) => Promise<{ entries: (GroupDelimiter | MediaFile)[]; }>;
  };
  eventHandlers: {
    onRequestPlay: EventHandler<MediaFile>;
  };
}) => {
  const store = new PlaylistStore(universe.currentFile);
  const presenter = new PlaylistPresenter(store, universe.localPlaylists, playlistsFetcher, playlistEntriesFetcher);

  const Playlist = observer(() => (
    <PlaylistView
      mode={viewport.mode != ViewportMode.LARGE && !store.expanded ? PlaylistViewMode.BAR : PlaylistViewMode.PANEL}
      expanded={viewport.mode != ViewportMode.LARGE && store.expanded}
      onRequestExpand={presenter.expand}
      onRequestCollapse={presenter.collapse}

      playlists={watchPromise(store.playlists)}
      currentPlaylist={store.currentPlaylist}
      currentPlaylistName={store.currentPlaylistName}
      currentPlaylistEntries={watchPromise(store.currentPlaylistEntries)}
      currentFile={universe.currentFile()}

      repeatMode={store.repeatMode}
      shuffleMode={store.shuffleMode}

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
      previousFile: () => store.previousFile,
      nextFile: () => store.nextFile,
    },
    disposers: [],
  };
};

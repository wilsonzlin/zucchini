import {AppFactory} from 'component/App/factory';
import {BrowserFactory} from 'component/Browser/factory';
import {PlayerFactory} from 'component/Player/factory';
import {PlaylistFactory} from 'component/Playlist/factory';
import {RepeatMode} from 'component/Playlist/state';
import {SearchFactory} from 'component/Search/factory';
import {ViewerFactory} from 'component/Viewer/factory';
import {UnreachableError} from 'extlib/js/assert/assert';
import {mapDefined} from 'extlib/js/optional/map';
import {action, configure, observable, reaction} from 'mobx';
import {File} from 'model/Listing';
import React from 'react';
import {ICollectionService} from 'service/CollectionService';
import './index.scss';

export * as CollectionService from './service/CollectionService';
export * as Listing from './model/Listing';

export const createZucchini = ({
  collectionService,
}: {
  collectionService: ICollectionService;
}) => {
  // TODO
  configure({enforceActions: 'observed'});

  const playPrevious = () => playFile(previousFileWrapped());
  const playNext = () => playFile(nextFileWrapped());

  const {
    views: {
      PlayerControl,
      PlayerViewport,
    },
    state: {
      currentFile,
      ended,
      playing,
    },
    actions: {
      playFile,
      togglePlayback,
    },
  } = PlayerFactory({
    dependencies: {
      imageElementFactory: () => new Image(),
      audioElementFactory: () => new Audio(),
      videoElementFactory: () => document.createElement('video'),
    },
    eventHandlers: {
      onRequestPlayPrevious: playPrevious,
      onRequestPlayNext: playNext,
    },
    universe: {},
  });

  const {
    views: {
      Search,
    },
    state: {
      query: searchQuery,
    },
  } = SearchFactory({
    dependencies: {
      suggester: collectionService.searchAutocomplete,
    },
    universe: {},
    eventHandlers: {},
  });

  const nowPlayingId = Symbol();
  const nowPlayingEntries = observable.array<File>([]);

  const {
    views: {
      Playlist,
    }, state: {
      nextFile,
      nextFileWrapped,
      previousFile,
      previousFileWrapped,
      repeatMode,
    },
  } = PlaylistFactory({
    dependencies: {
      initialPlaylist: nowPlayingId,
      playlistsFetcher: collectionService.getCustomPlaylists,
      playlistEntriesFetcher: collectionService.list,
    },
    universe: {
      currentFile,
      localPlaylists: () => [
        {id: nowPlayingId, name: 'Now playing', entries: nowPlayingEntries},
      ],
    },
    eventHandlers: {
      onRequestPlay: playFile,
    },
  });

  const autoplayDisposer = reaction(
    () => ended(),
    ended => {
      if (ended) {
        switch (repeatMode()) {
        case RepeatMode.OFF:
          // Leave viewer open at end.
          mapDefined(nextFile(), playFile);
          break;
        case RepeatMode.ONE:
          playFile(currentFile());
          break;
        case RepeatMode.ALL:
          playFile(nextFileWrapped());
          break;
        default:
          throw new UnreachableError();
        }
      }
    },
  );

  const {
    views: {
      Browser,
    },
    disposers: listViewDisposers,
  } = BrowserFactory({
    dependencies: {
      listFetcher: collectionService.list,
      Search,
    },
    eventHandlers: {
      onRequestPlayFiles: action(([files, initial]) => {
        nowPlayingEntries.replace(files);
        playFile(initial);
      }),
    },
    universe: {
      searchQuery,
    },
  });

  const {
    views: {
      Viewer,
    },
  } = ViewerFactory({
    dependencies: {
      PlayerControl: () => (
        <PlayerControl showFile={false} showPlaybackControls={false}/>
      ),
      PlayerViewport,
      playFile,
      Playlist,
    },
    universe: {
      currentFile,
      playing,
    },
    eventHandlers: {
      onNext: playNext,
      onPrevious: playPrevious,
      onTogglePlayback: togglePlayback,
    },
  });

  const {
    views: {
      App,
    },
  } = AppFactory({
    dependencies: {
      Browser,
      PlayerControl: () => (
        <PlayerControl showFile={true} showPlaybackControls={true}/>
      ),
      Playlist,
      Viewer,
    },
    eventHandlers: {},
    universe: {},
  });

  return {
    views: {
      App,
    },
    disposers: [
      autoplayDisposer,
      ...listViewDisposers,
    ],
  };
};

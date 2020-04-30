import {AppFactory} from 'component/App/factory';
import {ListViewFactory} from 'component/ListView/factory';
import {PlayerFactory} from 'component/Player/factory';
import {SearchFactory} from 'component/Search/factory';
import {configure, observable} from 'mobx';
import React from 'react';
import {PlaylistFactory} from './component/Playlist/factory';
import './index.scss';
import {MediaFile} from './model/Media';
import {SpecialPlaylist} from './model/Playlist';
import {ICollectionService} from './service/CollectionService';

export {ICollectionService} from './service/CollectionService';

export const createZucchini = ({
  collectionService,
}: {
  collectionService: ICollectionService;
}) => {
  // TODO
  configure({enforceActions: 'observed'});

  const {views: {PlayerControl}, state: {currentFile, ended}, actions: {playFile}} = PlayerFactory({
    dependencies: {
      imageElementFactory: () => new Image(),
      audioElementFactory: () => new Audio(),
      videoElementFactory: () => document.createElement('video'),
    },
    eventHandlers: {
      onRequestPlayPrevious: () => playFile(previousFile()),
      onRequestPlayNext: () => playFile(nextFile()),
    },
    universe: {},
  });

  const {views: {Search}, state: {query: searchQuery}} = SearchFactory({
    dependencies: {
      suggester: async (query) => (await collectionService.searchAutocomplete({query})).expansions,
    },
    universe: {},
    eventHandlers: {},
  });

  const NOW_PLAYING_PLAYLIST_ID = Symbol();
  const nowPlaylistPlaylist = observable.array<MediaFile>([]);

  const {views: {Playlist}, state: {previousFile, nextFile}} = PlaylistFactory({
    dependencies: {
      playlistsFetcher: async () => [
        ...(await collectionService.getCustomPlaylists({})).playlists,
        // TODO Names
        {id: SpecialPlaylist.LIKES, name: 'Likes', modifiable: false},
        {id: SpecialPlaylist.DISLIKES, name: 'Dislikes', modifiable: false},
      ],
      playlistEntriesFetcher: async ({playlistId, types, filter, continuation}) => {
        // TODO
        const listing = await collectionService.list({
          source: {playlist: playlistId},
          types,
          filter,
          continuation,
        });
        return {
          // TODO Stats
          entries: listing.results,
        };
      },
    },
    universe: {
      currentFile,
      // TODO Name
      localPlaylists: () => [{id: NOW_PLAYING_PLAYLIST_ID, name: 'Now playing', entries: nowPlaylistPlaylist}],
    },
    eventHandlers: {
      onRequestPlay: playFile,
    },
  });

  const {views: {List}, disposers: listViewDisposers} = ListViewFactory({
    dependencies: {
      listFetcher: (req) => collectionService.list(req),
    },
    eventHandlers: {
      onRequestPlayFiles: files => nowPlaylistPlaylist.replace(files),
    },
    universe: {
      searchQuery,
    },
  });

  const {views: {App}} = AppFactory({
    dependencies: {
      PlayerControl,
      Playlist,
      Search,
      List,
    },
    eventHandlers: {},
    universe: {},
  });

  return {
    views: {
      App,
    },
    disposers: [
      ...listViewDisposers,
    ],
  };
};

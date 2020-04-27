import {action} from 'mobx';
import {fromPromise} from 'mobx-utils';
import {assertExists} from '../../common/Sanity';
import {MediaFile, MediaFileType} from '../../model/Media';
import {GroupDelimiter, SpecialPlaylist} from '../../model/Playlist';
import {PlaylistStore, RepeatMode, ShuffleMode, UiPlaylistId} from './state';

export class PlaylistPresenter {
  constructor (
    private readonly store: PlaylistStore,
    private readonly localPlaylists: () => { id: symbol, name: string; entries: MediaFile[] }[],
    private readonly playlistsFetcher: () => Promise<{ id: SpecialPlaylist | string; name: string; modifiable: boolean; }[]>,
    private readonly playlistEntriesFetcher: (req: { playlistId: SpecialPlaylist | string; types: MediaFileType[]; filter?: string; continuation?: string; }) => Promise<{ entries: (GroupDelimiter | MediaFile)[]; }>,
  ) {
  }

  @action
  fetchPlaylists = () => {
    this.store.playlists = fromPromise((async () => {
      return [
        ...this.localPlaylists().map(playlist => ({
          id: playlist.id,
          name: playlist.name,
          // TODO
          modifiable: false,
        })),
        ...await this.playlistsFetcher(),
      ];
    })());
  };

  @action
  setCurrentPlaylist = (id: UiPlaylistId | undefined) => {
    this.store.currentPlaylist = id;
    if (typeof id == 'symbol') {
      // Local playlist.
      const playlist = assertExists(this.localPlaylists().find(p => p.id === id));
      this.store.currentPlaylistEntries = fromPromise(Promise.resolve(playlist.entries));
    } else if (id != undefined) {
      // Remote playlist.
      this.store.currentPlaylistEntries = fromPromise((async () => {
        return (await this.playlistEntriesFetcher({
          playlistId: id,
          // TODO
          types: [],
        })).entries;
      })());
    }
  };

  @action
  updateRepeatMode = (mode: RepeatMode) => {
    this.store.repeatMode = mode;
  };

  @action
  updateShuffleMode = (mode: ShuffleMode) => {
    this.store.shuffleMode = mode;
  };

  @action
  expand = () => {
    this.store.expanded = true;
  };

  @action
  collapse = () => {
    this.store.expanded = false;
  };
}

import {createAtMostOneAsyncFlow} from 'common/Async';
import {assertExists} from 'extlib/js/optional/assert';
import {action} from 'mobx';
import {fromPromise} from 'mobx-utils';
import {Listing} from 'model/Listing';
import {GetCustomPlaylistsApi, ListApi} from 'service/CollectionService';
import {PlaylistStore, RepeatMode, ShuffleMode, UiPlaylistId} from './state';

export class PlaylistPresenter {
  constructor (
    private readonly store: PlaylistStore,
    private readonly localPlaylists: () => { id: symbol, name: string; entries: Listing[] }[],
    private readonly playlistsFetcher: GetCustomPlaylistsApi,
    private readonly playlistEntriesFetcher: ListApi,
  ) {
  }

  @action
  fetchCustomPlaylists = () => {
    this.store.customPlaylists = fromPromise(
      this.playlistsFetcher({}).then(r => r.playlists),
    );
  };

  @action
  switchPlaylist = (id: UiPlaylistId | undefined) => {
    this.store.id = id;
    if (id !== undefined) {
      this.fetchCurrentPlaylist();
    }
  };

  private fetchCurrentPlaylist = createAtMostOneAsyncFlow(
    () => {
      this.store.loading = true;
      this.store.error = '';
    },
    async () => typeof this.store.id == 'symbol'
      // Local playlist.
      ? assertExists(this.localPlaylists().find(p => p.id === this.store.id)).entries
      // Remote playlist.
      : (await this.playlistEntriesFetcher({
        source: {playlist: assertExists(this.store.id)},
        types: [],
      })).results,
    val => this.store.entries = val,
    err => this.store.error = err.message,
    () => this.store.loading = false,
  );

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

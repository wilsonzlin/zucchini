import {PlaylistStore, RepeatMode, ShuffleMode} from './state';
import {action} from 'mobx';
import {ISong} from '../../model/Song';
import {assert, assertExists} from '../../common/Sanity';

export const enum PlayNextMode {
  IGNORE_REPEAT_ONCE,
  PREVIOUS,
  NEXT,
}

export class PlaylistPresenter {
  constructor (
    private readonly store: PlaylistStore,
    // We can't simply react to currentSong as sometimes we want to replay the same song (e.g. repeat once or repeat all but only one song).
    private readonly playSong: (song: ISong | undefined) => void,
  ) {
  }

  @action
  updateRepeatMode = (mode: RepeatMode) => {
    this.store.repeatMode = mode;
  };

  @action
  updateShuffleMode = (mode: ShuffleMode) => {
    this.store.shuffleMode = mode;
  };

  @action
  updateAndPlayNowPlayingPlaylist = (songs: ISong[]) => {
    assert(songs.length > 0);
    this.store.nowPlayingPlaylist = songs;
    this.store.currentPlaylist = undefined;
    this.playSong(this.store.currentSong = songs[0]);
  };

  @action
  playSpecific = (song: ISong) => {
    assertExists(this.store.currentPlaylistSongs.find(s => s.file == song.file));
    this.playSong(this.store.currentSong = song);
  };

  @action
  playNext = (mode: PlayNextMode) => {
    const current = this.store.currentSong;
    if (!current) {
      return;
    }
    const dir = mode == PlayNextMode.PREVIOUS ? -1 : 1;
    const songs = this.store.currentPlaylistSongs;
    const index = songs.findIndex(s => s.file === current.file);
    let next;
    switch (this.store.repeatMode) {
    case RepeatMode.OFF:
      next = index + dir < 0 || index + dir >= songs.length ? undefined : songs[index + dir];
      break;
      // @ts-ignore
    case RepeatMode.ONE:
      if (mode != PlayNextMode.IGNORE_REPEAT_ONCE) {
        next = current;
        break;
      }
      // Fallthrough.
    case RepeatMode.ALL:
      next = songs[(index + songs.length + dir) % songs.length];
      break;
    }
    this.store.currentSong = next;
    this.playSong(next);
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

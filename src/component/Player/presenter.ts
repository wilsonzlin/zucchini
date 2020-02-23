import {action} from 'mobx';
import {ISong} from 'model/Song';
import {PlayerStore} from './state';

export class PlayerPresenter {
  constructor (
    private readonly store: PlayerStore,
  ) {
  }

  @action
  private setSong = (song: ISong | undefined) => {
    this.store.song = song;
  };

  @action
  setPlaying = (playing: boolean) => {
    this.store.playing = playing;
  };

  @action
  setSource = (source: string | null) => {
    this.store.source = source;
  };

  @action
  setCurrentTime = (currentTime: number) => {
    this.store.currentTime = currentTime;
  };

  @action
  setVolume = (volume: number) => {
    this.store.volume = volume;
  };

  @action
  play = (song: ISong | undefined) => {
    if (song) {
      if (this.store.song?.file === song.file) {
        this.store.currentTime = 0;
      } else {
        this.setSource(song.file);
      }
      this.setPlaying(true);
    } else {
      this.setSource(null);
    }
    this.setSong(song);
  };

  @action
  setHoveringSongDetails = (hovering: boolean) => {
    this.store.hoveringSongDetails = hovering;
  };
}

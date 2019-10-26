import {action} from "mobx";
import {Song} from "model/Song";
import {PlayerStore, RepeatMode, ShuffleMode} from "./state";

export class PlayerPresenter {
  constructor (
    private readonly store: PlayerStore,
  ) {
  }

  @action
  private setSong = (song: Song | undefined) => {
    this.store.song = song;
  };

  @action
  setRepeatMode = (mode: RepeatMode) => {
    this.store.repeatMode = mode;
  };

  @action
  setShuffleMode = (mode: ShuffleMode) => {
    this.store.shuffleMode = mode;
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
  play = (song: Song) => {
    this.setSource(song.file);
    this.setPlaying(true);
    this.setSong(song);
  };

  @action
  setHoveringSongDetails = (hovering: boolean) => {
    this.store.hoveringSongDetails = hovering;
  };
}

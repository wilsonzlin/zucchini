import {action} from 'mobx';
import {File} from 'model/Listing';
import {callHandler, EventHandler} from 'common/Event';
import {PlayerStore} from './state';

export class PlayerPresenter {
  constructor (
    private readonly store: PlayerStore,
    private readonly onRequestPlayPrevious: EventHandler,
  ) {
  }

  @action
  setPlaying = (playing: boolean) => {
    if (playing && this.store.ended) {
      this.store.currentTime = 0;
    }
    this.store.playing = playing;
  };

  togglePlayback = () => {
    this.setPlaying(!this.store.playing);
  };

  @action
  setFile = (file: File | undefined) => {
    this.store.file = file;
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
  playFile = (file: File | undefined) => {
    if (!file) {
      this.setFile(undefined);
    } else {
      if (this.store.file?.id === file.id) {
        this.store.currentTime = 0;
      } else {
        this.setFile(file);
      }
      this.setPlaying(true);
    }
  };

  @action
  restartOrGoToPreviousFile = () => {
    if (this.store.currentTime > 4) {
      this.store.currentTime = 0;
    } else {
      callHandler(this.onRequestPlayPrevious);
    }
  };

  @action
  setShowFileDetailsCard = (show: boolean) => {
    this.store.showFileDetailsCard = show;
  };
}

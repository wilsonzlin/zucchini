import {action} from 'mobx';
import {callHandler, EventHandler} from '../../common/Event';
import {MediaFile} from '../../model/Media';
import {PlayerStore} from './state';

export class PlayerPresenter {
  constructor (
    private readonly store: PlayerStore,
    private readonly onRequestPlayPrevious: EventHandler,
  ) {
  }

  @action
  setPlaying = (playing: boolean) => {
    this.store.playing = playing;
  };

  @action
  setFile = (file: MediaFile | undefined) => {
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
  playFile = (file: MediaFile | undefined) => {
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

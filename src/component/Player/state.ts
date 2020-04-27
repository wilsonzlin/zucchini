import {computed, observable} from 'mobx';
import {MediaFile, MediaFileType} from '../../model/Media';
import {AVElement} from './Media/AVElement';
import {ImageElement} from './Media/ImageElement';
import {MediaDataState} from './Media/MediaData';

export class PlayerStore {
  @observable.ref showFileDetailsCard: boolean = false;

  private readonly videoElement: AVElement<HTMLVideoElement>;
  private readonly audioElement: AVElement<HTMLAudioElement>;
  private readonly imageElement: ImageElement;

  @observable.ref private _file: MediaFile | undefined = undefined;

  constructor (
    videoElementFactory: () => HTMLVideoElement,
    audioElementFactory: () => HTMLAudioElement,
    imageElementFactory: () => HTMLImageElement,
  ) {
    this.videoElement = new AVElement<HTMLVideoElement>(videoElementFactory);
    this.audioElement = new AVElement<HTMLAudioElement>(audioElementFactory);
    this.imageElement = new ImageElement(imageElementFactory);
  }

  @computed get file (): MediaFile | undefined {
    return this._file;
  }

  set file (file: MediaFile | undefined) {
    this.audioElement.source = file?.type === MediaFileType.AUDIO ? file.url : undefined;
    this.videoElement.source = file?.type === MediaFileType.VIDEO ? file.url : undefined;
    this.imageElement.source = file?.type === MediaFileType.PHOTO ? file.url : undefined;
    this._file = file;
  }

  @computed get dataState (): MediaDataState {
    switch (this.file?.type) {
    case MediaFileType.PHOTO:
      return this.imageElement.dataState;
    case MediaFileType.VIDEO:
      return this.videoElement.dataState;
    case MediaFileType.AUDIO:
      return this.audioElement.dataState;
    case undefined:
      return MediaDataState.CAN_PLAY;
    }
  }

  @computed get ended (): boolean {
    switch (this.file?.type) {
    case MediaFileType.PHOTO:
      return this.imageElement.ended;
    case MediaFileType.AUDIO:
      return this.audioElement.ended;
    case MediaFileType.VIDEO:
      return this.videoElement.ended;
    case undefined:
      return false;
    }
  }

  @computed get playing (): boolean {
    switch (this.file?.type) {
    case MediaFileType.AUDIO:
      return this.audioElement.playing;
    case MediaFileType.VIDEO:
      return this.videoElement.playing;
    case MediaFileType.PHOTO:
      return this.imageElement.playing;
    case undefined:
      return false;
    }
  }

  set playing (play: boolean) {
    switch (this.file?.type) {
    case MediaFileType.AUDIO:
      this.audioElement.playing = play;
      break;
    case MediaFileType.VIDEO:
      this.videoElement.playing = play;
      break;
    case MediaFileType.PHOTO:
      this.imageElement.playing = play;
      break;
    }
  }

  @computed get photoDuration () {
    return this.imageElement.duration;
  }

  set photoDuration (duration) {
    this.imageElement.duration = duration;
  }

  @computed get duration (): number {
    switch (this._file?.type) {
    case MediaFileType.AUDIO:
    case MediaFileType.VIDEO:
      return this._file.duration;
    case MediaFileType.PHOTO:
      return this.photoDuration;
    case undefined:
      return 0;
    }
  }

  @computed get volume (): number {
    // Video element is source of truth.
    return this.videoElement.volume;
  }

  set volume (value: number) {
    this.videoElement.volume = this.audioElement.volume = value;
  }

  @computed get muted (): boolean {
    // Video element is source of truth.
    return this.videoElement.muted;
  }

  set muted (value: boolean) {
    this.videoElement.muted = this.audioElement.muted = value;
  }

  @computed get currentTime (): number {
    switch (this.file?.type) {
    case MediaFileType.VIDEO:
      return this.videoElement.currentTime;
    case  MediaFileType.AUDIO:
      return this.audioElement.currentTime;
    case MediaFileType.PHOTO:
      return this.imageElement.currentTime;
    case undefined:
      return 0;
    }
  }

  set currentTime (value: number) {
    switch (this.file?.type) {
    case MediaFileType.AUDIO:
      this.audioElement.currentTime = value;
      break;
    case MediaFileType.VIDEO:
      this.videoElement.currentTime = value;
      break;
    case MediaFileType.PHOTO:
      this.imageElement.currentTime = value;
      break;
    }
  }

  @computed get playbackRate (): number {
    // Video element is source of truth.
    return this.videoElement.playbackRate;
  }

  set playbackRate (value: number) {
    this.videoElement.playbackRate = this.audioElement.playbackRate = value;
  }
}

import {computed, observable} from 'mobx';
import {File} from 'model/Listing';
import {AVElement} from './Media/AVElement';
import {ImageElement} from './Media/ImageElement';
import {MediaDataState} from './Media/MediaData';

export class PlayerStore {
  @observable.ref showFileDetailsCard: boolean = false;

  private readonly videoElement: AVElement<HTMLVideoElement>;
  private readonly audioElement: AVElement<HTMLAudioElement>;
  private readonly imageElement: ImageElement;

  @observable.ref private _file: File | undefined = undefined;

  constructor (
    videoElementFactory: () => HTMLVideoElement,
    audioElementFactory: () => HTMLAudioElement,
    imageElementFactory: () => HTMLImageElement,
  ) {
    this.videoElement = new AVElement<HTMLVideoElement>(videoElementFactory);
    this.audioElement = new AVElement<HTMLAudioElement>(audioElementFactory);
    this.imageElement = new ImageElement(imageElementFactory);
  }

  @computed get file (): File | undefined {
    return this._file;
  }

  set file (file: File | undefined) {
    this.audioElement.source = file?.type === 'audio' ? file.url : undefined;
    this.videoElement.source = file?.type === 'video' ? file.url : undefined;
    this.imageElement.source = file?.type === 'photo' ? file.url : undefined;
    this._file = file;
  }

  @computed get viewElement (): HTMLElement | undefined {
    switch (this.file?.type) {
    case 'photo':
      return this.imageElement.element;
    case 'video':
      return this.videoElement.element;
    case 'audio':
      return this.audioElement.element;
    case undefined:
      return undefined;
    }
  }

  @computed get dataState (): MediaDataState {
    switch (this.file?.type) {
    case 'photo':
      return this.imageElement.dataState;
    case 'video':
      return this.videoElement.dataState;
    case 'audio':
      return this.audioElement.dataState;
    case undefined:
      return MediaDataState.CAN_PLAY;
    }
  }

  @computed get ended (): boolean {
    switch (this.file?.type) {
    case 'photo':
      return this.imageElement.ended;
    case 'audio':
      return this.audioElement.ended;
    case 'video':
      return this.videoElement.ended;
    case undefined:
      return false;
    }
  }

  @computed get playing (): boolean {
    switch (this.file?.type) {
    case 'audio':
      return this.audioElement.playing;
    case 'video':
      return this.videoElement.playing;
    case 'photo':
      return this.imageElement.playing;
    case undefined:
      return false;
    }
  }

  set playing (play: boolean) {
    switch (this.file?.type) {
    case 'audio':
      this.audioElement.playing = play;
      break;
    case 'video':
      this.videoElement.playing = play;
      break;
    case 'photo':
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
    case 'audio':
    case 'video':
      return this._file.duration;
    case 'photo':
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
    case 'video':
      return this.videoElement.currentTime;
    case  'audio':
      return this.audioElement.currentTime;
    case 'photo':
      return this.imageElement.currentTime;
    case undefined:
      return 0;
    }
  }

  set currentTime (value: number) {
    switch (this.file?.type) {
    case 'audio':
      this.audioElement.currentTime = value;
      break;
    case 'video':
      this.videoElement.currentTime = value;
      break;
    case 'photo':
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

import {action, computed, observable} from 'mobx';
import {MediaDataState} from './MediaData';

export class AVElement<T extends HTMLMediaElement> {
  readonly element: T;

  // For video and audio files, the HTMLMediaElement is the source of truth for these values.
  // However, since it uses events and not observables, these observables are "proxies" for the real values and are updated when events occur on the HTMLAudioElement.
  // Since these are proxies, they should only be set from event handlers on the internal audio element. To actually update these values, setters on this store are created that modify/call the media element.
  // Note that these values could get changed externally e.g. device media keys.
  @observable.ref private _playing: boolean = false;
  @observable.ref private _dataState: MediaDataState = MediaDataState.CAN_PLAY;
  @observable.ref private _currentTime: number = 0;
  @observable.ref private _ended: boolean = false;
  @observable.ref private _duration: number = 0;
  @observable.ref private _volume: number = 1;
  @observable.ref private _muted: boolean = false;
  @observable.ref private _playbackRate: number = 1;

  constructor (elemFactory: () => T) {
    const elem = this.element = elemFactory();

    // Sync store with future element changes.
    elem.oncanplay = action(() => this._dataState = MediaDataState.CAN_PLAY);
    elem.ondurationchange = action(() => this._duration = elem.duration);
    elem.onended = action(() => this._ended = true);
    elem.onerror = action(() => this._dataState = MediaDataState.ERROR);
    elem.onwaiting = action(() => this._dataState = MediaDataState.LOADING);
    elem.onpause = action(() => this._playing = false);
    elem.onplaying = action(() => this._playing = true);
    elem.onratechange = action(() => this._playbackRate = elem.playbackRate);
    elem.ontimeupdate = action(() => {
      this._currentTime = elem.currentTime;
      this._ended = elem.ended;
    });
    elem.onvolumechange = action(() => {
      this._volume = elem.volume;
      this._muted = elem.muted;
    });
  }

  @computed get source (): string | undefined {
    return this.element.src || undefined;
  }

  set source (src) {
    this.element.src = src || '';
  }

  @computed get playing () {
    return this._playing;
  }

  set playing (play) {
    play ? this.element.play() : this.element.pause();
  }

  // Only valid when a source has been set.
  @computed get dataState () {
    return this._dataState;
  }

  @computed get currentTime () {
    return this._currentTime;
  }

  set currentTime (time) {
    this.element.currentTime = time;
  }

  @computed get ended () {
    return this._ended;
  }

  @computed get duration () {
    return this._duration;
  }

  @computed get playbackRate () {
    return this._playbackRate;
  }

  set playbackRate (rate) {
    this.element.playbackRate = rate;
  }

  @computed get volume () {
    return this._volume;
  }

  set volume (volume) {
    this.element.volume = volume;
  }

  @computed get muted () {
    return this._muted;
  }

  set muted (muted) {
    this.element.muted = muted;
  }
}

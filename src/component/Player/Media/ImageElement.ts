import {action, computed, observable} from 'mobx';
import {MediaDataState} from './MediaData';

const PLAYBACK_TICK_RATE_MS = 250;

export class ImageElement {
  private readonly element: HTMLImageElement;

  // This should match up with HTMLMediaElement, namely:
  // - Be false when CAN_PLAY and paused or ended, and otherwise true.
  // - Be either true or false when LOADING.
  // - Be false when ERROR.
  @observable.ref private _playing: boolean = false;
  @observable.ref private _dataState: MediaDataState = MediaDataState.CAN_PLAY;
  // Value not valid when in ERROR state.
  @observable.ref private _currentTime: number = 0;

  @observable.ref duration: number = 5;

  private playbackTicker: number | undefined = undefined;

  // This function intentionally does not clear any existing timeout or check `_playing`/`_dataState`.
  @action
  private tickPlayback () {
    this.playbackTicker = window.setTimeout(() => {
      if ((this._currentTime += PLAYBACK_TICK_RATE_MS) < this.duration) {
        this.tickPlayback();
      } else {
        this._currentTime = this.duration;
        this._playing = false;
      }
    }, PLAYBACK_TICK_RATE_MS);
  }

  // This should be called when any of `_playing`, `_dataState`, or `_currentTime` are set outside this function or `tickPlayback`.
  // When `_playing` is set to true, it will check that it's legal to (i.e. CAN_PLAY) and if so, start ticking. Otherwise, it snaps back to `false`.
  // If it's loading, `_playing` will be left as true but ticking won't start; the `onload` handler will eventually update the state, which will then start ticking.
  // When `_dataState` changes while `_playing` is true, if it's no longer legal (i.e. not CAN_PLAY), `_playing` will be set to `false`.
  // When `_currentTime` changes during playback, ticking will restart.
  private reactPlayback () {
    clearTimeout(this.playbackTicker);
    if (this._playing && this._dataState == MediaDataState.CAN_PLAY) {
      this.tickPlayback();
    } else if (this._dataState != MediaDataState.LOADING) {
      this._playing = false;
    }
  }

  constructor (elemFactory: () => HTMLImageElement) {
    const elem = this.element = elemFactory();

    elem.onload = action(() => {
      this._dataState = MediaDataState.CAN_PLAY;
      this.reactPlayback();
    });
    elem.onerror = action(() => {
      this._dataState = MediaDataState.ERROR;
      this.reactPlayback();
    });
  }

  @computed get source (): string | undefined {
    return this.element.src || undefined;
  }

  set source (src) {
    this.element.src = src || '';
    this._dataState = MediaDataState.LOADING;
    this.reactPlayback();
  }

  @computed get playing () {
    return this._playing;
  }

  set playing (play) {
    this._playing = play;
    this.reactPlayback();
  }

  // Only valid when a source has been set.
  @computed get dataState () {
    return this._dataState;
  }

  @computed get currentTime () {
    return this._currentTime;
  }

  set currentTime (time) {
    this._currentTime = time;
    this.reactPlayback();
  }

  @computed get ended () {
    return this._currentTime >= this.duration;
  }
}

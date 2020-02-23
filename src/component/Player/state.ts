import {INTEGER_CODEC, PlayerLSKey} from 'common/LocalStorage';
import {action, computed, observable} from 'mobx';
import {ISong} from 'model/Song';

const DEFAULT_VOLUME = 1;

const VOLUME = new PlayerLSKey('PLAYER_VOLUME', INTEGER_CODEC);

export class PlayerStore {
  // The HTMLAudioElement is the source of truth for these values.
  // However, since it uses events and not observables, these
  // observables are "proxies" for the real values and are updated
  // when events occur on the HTMLAudioElement.
  // Since these are proxies, they should only be set to from event
  // handlers on the internal audio element. To actually update the
  // element's values, setters are created that modify/call the audio
  @observable song?: ISong;
  @observable hoveringSongDetails: boolean = false;
  // element, not these values.
  private readonly audio: HTMLAudioElement;
  // A number between 0 and this.duration (inclusive).
  @observable private proxyCurrentTime: number = 0;
  @observable private proxyEnded: boolean = true;
  @observable private proxyLoading: boolean = false;
  @observable private proxyPlaying: boolean = false;
  @observable private proxySource: string | null = null;
  // A number between 0 and 1 (inclusive).
  @observable private proxyVolume: number = DEFAULT_VOLUME;

  constructor (
    Audio: new () => HTMLAudioElement,
  ) {
    const audio = this.audio = new Audio();
    audio.volume = VOLUME.getOrDefault(DEFAULT_VOLUME);
    audio.oncanplay = action(() => this.proxyLoading = false);
    audio.onended = action(() => {
      this.proxyEnded = true;
      this.proxyPlaying = false;
    });
    audio.onerror = action(() => this.proxyLoading = this.proxyPlaying = false);
    audio.onloadstart = action(() => this.proxyLoading = true);
    audio.onpause = action(() => this.proxyPlaying = false);
    audio.onplaying = action(() => {
      this.proxyEnded = false;
      this.proxyPlaying = true;
    });
    audio.ontimeupdate = action(() => this.proxyCurrentTime = audio.currentTime);
    audio.onvolumechange = action(() => this.proxyVolume = audio.volume);
  }

  @computed get volume (): number {
    return this.proxyVolume;
  }

  set volume (value: number) {
    this.audio.volume = value;
  }

  @computed get currentTime (): number {
    return this.proxyCurrentTime;
  }

  set currentTime (value: number) {
    this.audio.currentTime = value;
  }

  @computed get progress () {
    return this.proxyCurrentTime;
  }

  @computed get source (): string | null {
    return this.proxySource;
  }

  // Loading should represent the HTMLAudioElement's state only,

  set source (value: string | null) {
    this.audio.src = value || '';
  }

  // so should not be modifiable externally.
  @computed get loading (): boolean {
    return this.proxyLoading;
  }

  @computed get playing (): boolean {
    return this.proxyPlaying;
  }

  set playing (value: boolean) {
    value ? this.audio.play() : this.audio.pause();
  }

  @computed get ended (): boolean {
    return this.proxyEnded;
  }
}

export class PlayerState {
  constructor (
    private readonly store: PlayerStore,
  ) {
  }

  hasEnded = () => {
    return this.store.ended;
  };
}

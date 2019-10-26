import {INTEGER_CODEC, PlayerLSKey} from "common/LocalStorage";
import {computed, observable} from "mobx";
import {Song} from "model/Song";

export const enum RepeatMode {
  OFF,
  ONE,
  ALL,
}

export const enum ShuffleMode {
  OFF,
  ALL,
}

const DEFAULT_VOLUME = 1;

const VOLUME = new PlayerLSKey("PLAYER_VOLUME", INTEGER_CODEC);
const REPEAT_MODE = new PlayerLSKey<RepeatMode>("PLAYER_REPEAT_MODE", INTEGER_CODEC);
const SHUFFLE_MODE = new PlayerLSKey<ShuffleMode>("PLAYER_SHUFFLE_MODE", INTEGER_CODEC);

export class PlayerStore {
  @observable repeatMode: RepeatMode = REPEAT_MODE.getOrDefault(RepeatMode.OFF);
  @observable shuffleMode: ShuffleMode = SHUFFLE_MODE.getOrDefault(ShuffleMode.OFF);

  // The HTMLAudioElement is the source of truth for these values.
  // However, since it uses events and not observables, these
  // observables are "proxies" for the real values and are updated
  // when events occur on the HTMLAudioElement.
  // Since these are proxies, they should only be set to from event
  // handlers on the internal audio element. To actually update the
  // element's values, setters are created that modify/call the audio
  // element, not these values.
  private readonly audio: HTMLAudioElement;
  @observable private proxyPlaying: boolean = false;
  @observable private proxyLoading: boolean = false;
  @observable private proxySource: string | null = null;
  // A number between 0 and this.duration (inclusive).
  @observable private proxyCurrentTime: number = 0;
  // A number between 0 and 1 (inclusive).
  @observable private proxyVolume: number = DEFAULT_VOLUME;

  @observable song?: Song;

  @observable hoveringSongDetails: boolean = false;

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

  set source (value: string | null) {
    this.audio.src = value || "";
  }

  // Loading should represent the HTMLAudioElement's state only,
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

  constructor (Audio: new () => HTMLAudioElement) {
    const audio = this.audio = new Audio();
    audio.volume = VOLUME.getOrDefault(DEFAULT_VOLUME);
    audio.oncanplay = () => this.proxyLoading = false;
    audio.onended = () => this.proxyPlaying = false;
    audio.onloadstart = () => this.proxyLoading = true;
    audio.onpause = () => this.proxyPlaying = false;
    audio.onplaying = () => this.proxyPlaying = true;
    audio.ontimeupdate = () => this.proxyCurrentTime = audio.currentTime;
    audio.onvolumechange = () => this.proxyVolume = audio.volume;
  }
}

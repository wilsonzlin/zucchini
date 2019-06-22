import {store} from "../index";
import {playerAction} from "../state/PlayerState";

export const audioEngine = new Audio();

audioEngine.oncanplay = () => store.dispatch(playerAction("AWAITING_NETWORK", {awaitingNetwork: false}));
audioEngine.onended = () => store.dispatch(playerAction("UPDATE_PLAYBACK", {isPlaying: false}));
audioEngine.onloadedmetadata = () => store.dispatch(playerAction("UPDATE_DURATION", {duration: audioEngine.duration}));
audioEngine.onloadstart = () => store.dispatch(playerAction("AWAITING_NETWORK", {awaitingNetwork: true}));
audioEngine.onpause = () => store.dispatch(playerAction("UPDATE_PLAYBACK", {isPlaying: false}));
audioEngine.onplaying = () => store.dispatch(playerAction("UPDATE_PLAYBACK", {isPlaying: true}));
audioEngine.ontimeupdate = () => store.dispatch(
  playerAction("UPDATE_PROGRESS", {progress: audioEngine.currentTime / audioEngine.duration * 100}));
audioEngine.onvolumechange = () => store.dispatch(playerAction("UPDATE_VOLUME", {volume: audioEngine.volume * 100, muted: audioEngine.muted}));

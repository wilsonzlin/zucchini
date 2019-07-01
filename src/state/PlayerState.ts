import {createCreateActionFunction, createReducer, GlobalDispatcher} from "../common/Action";
import {
  OptionalAlbumName,
  OptionalArtistName,
  OptionalTitleName,
  RepeatMode,
  ShuffleMode,
} from "../common/Media";
import {getKeyOrDefault, PLAYER_REPEAT_MODE, PLAYER_SHUFFLE_MODE, PLAYER_VOLUME, setKey} from "../common/LocalStorage";
import {audioEngine} from "../system/AudioEngine";
import {undefinedFallback} from "../common/Util";
import {AppState} from "./AppState";

export interface PlayerState {
  repeatMode: RepeatMode,
  shuffleMode: ShuffleMode,

  playing: boolean;
  loading: boolean;

  source: string | null;

  artist: OptionalArtistName;
  album: OptionalAlbumName;
  title: OptionalTitleName;
  duration: number;

  progress: number;
  volume: number;
  muted: boolean;
}

export interface PlayerActions {
  UPDATE_PLAYBACK: {
    isPlaying: boolean;
  };
  AWAITING_NETWORK: {
    awaitingNetwork: boolean;
  };
  UPDATE_SOURCE: {
    source: string;
  };
  UPDATE_SONG_DETAILS: {
    artist: OptionalArtistName;
    album: OptionalAlbumName;
    title: OptionalTitleName;
  };
  UPDATE_DURATION: {
    duration: number;
  };
  UPDATE_PROGRESS: {
    progress: number;
  };
  UPDATE_VOLUME: {
    volume: number;
    muted: boolean;
  };
}

export const playerAction = createCreateActionFunction<PlayerActions>();

export const playerChangeVolumeThunk = (action: { volume: number }) =>
  () => {
    audioEngine.volume = action.volume / 100;
  };

export const playerSeekThunk = (action: { seekTo: number }) =>
  () => {
    audioEngine.currentTime = action.seekTo;
  };

export const playerPlayOrPauseThunk = (action: { shouldPlay: boolean }) =>
  () => {
    action.shouldPlay ? audioEngine.play() : audioEngine.pause();
  };

export const playerToggleMuteThunk = (action: { mute: boolean }) =>
  () => {
    audioEngine.muted = action.mute;
  };

export const playerPlaySongThunk = (action: { file: string }) =>
  (dispatch: GlobalDispatcher, getState: () => AppState) => {
    const song = getState().library.songs.find(s => s.file === action.file)!;
    audioEngine.src = song.file;
    audioEngine.play();
    dispatch(playerAction("UPDATE_SONG_DETAILS", {
      album: song.album,
      artist: undefinedFallback<OptionalArtistName>(song.artists[0], null),
      title: song.title,
    }));
  };

export const PlayerReducer = createReducer<PlayerState, PlayerActions>({
  repeatMode: getKeyOrDefault(PLAYER_REPEAT_MODE, RepeatMode.ALL),
  shuffleMode: getKeyOrDefault(PLAYER_SHUFFLE_MODE, ShuffleMode.OFF),

  playing: false,
  loading: false,

  source: null,

  artist: "",
  album: "",
  title: "",
  duration: 0,

  progress: 0,
  volume: getKeyOrDefault(PLAYER_VOLUME, 100),
  muted: false,
}, {
  UPDATE_PLAYBACK: (state, action) => ({
    ...state,
    playing: action.isPlaying,
  }),
  AWAITING_NETWORK: (state, action) => ({
    ...state,
    loading: action.awaitingNetwork,
  }),
  UPDATE_SOURCE: (state, action) => ({
    ...state,
    source: action.source || null,
  }),
  UPDATE_PROGRESS: (state, action) => ({
    ...state,
    progress: action.progress,
  }),
  UPDATE_DURATION: (state, action) => ({
    ...state,
    duration: action.duration,
  }),
  UPDATE_VOLUME: (state, action) => ({
    ...state,
    volume: setKey(PLAYER_VOLUME, action.volume),
    muted: action.muted,
  }),
  UPDATE_SONG_DETAILS: (state, action) => ({
    ...state,
    artist: action.artist,
    album: action.album,
    title: action.title,
  }),
});

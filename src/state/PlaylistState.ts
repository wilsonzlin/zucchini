import {createCreateActionFunction, createReducer} from "../common/Action";
import {Song} from "../common/Media";

export interface PlaylistSongState {
  song: Song;
  playing: boolean;
}

export interface PlaylistState {
  songs: PlaylistSongState[];
  visible: boolean;
}

export interface PlaylistActions {
}

export const playlistAction = createCreateActionFunction<PlaylistActions>();

export const PlaylistReducer = createReducer<PlaylistState, PlaylistActions>({
  songs: [],
  visible: false,
}, {});

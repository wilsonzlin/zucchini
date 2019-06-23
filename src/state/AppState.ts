import {PlayerReducer, PlayerState} from "./PlayerState";
import {combineReducers} from "redux";
import {LibraryReducer, LibraryState} from "./LibraryState";
import {PlaylistReducer, PlaylistState} from "./PlaylistState";

export interface AppState {
  player: PlayerState;
  library: LibraryState;
  playlist: PlaylistState;
}

export const AppReducer = combineReducers({
  player: PlayerReducer,
  library: LibraryReducer,
  playlist: PlaylistReducer,
});

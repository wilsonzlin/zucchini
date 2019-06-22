import {PlayerReducer, PlayerState} from "./PlayerState";
import {combineReducers} from "redux";
import {LibraryReducer, LibraryState} from "./LibraryState";

export interface AppState {
  player: PlayerState;
  library: LibraryState;
}

export const AppReducer = combineReducers({
  player: PlayerReducer,
  library: LibraryReducer,
});

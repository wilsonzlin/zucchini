import {AnyAction, Store} from "redux";
import {AppState} from "../state/AppState";

export type ActionObject<ACTIONS, TYPE extends keyof ACTIONS> = {
  [property in keyof ACTIONS[TYPE]]: ACTIONS[TYPE][property];
} & { type: TYPE; };

// This is necessary because TypeScript 3.5 cannot infer TYPE from
// <ACTIONS, TYPE extends keyof ACTIONS> (type: TYPE, data: ACTIONS[TYPE])
// when $type is provided as a string, necessitating <Actions, "TYPE">("TYPE", {...}).
export const createCreateActionFunction =
  <ACTIONS>
  () =>
    <TYPE extends keyof ACTIONS>
    (type: TYPE, data: ACTIONS[TYPE]): ActionObject<ACTIONS, TYPE> =>
      ({type, ...data});

export type Reducers<S, ACTIONS> = {
  [action in keyof ACTIONS]: (state: S, action: ActionObject<ACTIONS, action>) => S;
}

export const createReducer = <S, ACTIONS> (initialState: S, reducers: Reducers<S, ACTIONS>) => {
  return (state: S = initialState, action: AnyAction) => {
    if (reducers.hasOwnProperty(action.type)) {
      return reducers[action.type](state, action);
    } else {
      return state;
    }
  };
};

export type GlobalStore = Store<AppState>;
// TODO
export type GlobalDispatcher = any;

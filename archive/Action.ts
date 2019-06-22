import {Action, Action as ReduxAction, Dispatch, Middleware, MiddlewareAPI, Reducer} from "redux";

export type ActionClass<S> = new (...args: any[]) => Action<S>;

export abstract class Action<S> implements ReduxAction<ActionClass<S>> {
  readonly type = this.constructor as ActionClass<S>;

  abstract reduce (state: S): S;

  sidecar (dispatch: Dispatch<Action<any>>): void {
  }
}

export const sidecarActionsMiddleware: Middleware = ({dispatch}: MiddlewareAPI) => next => action => {
  action.sidecar(dispatch);
  return next({
    ...action,
  });
};

export const createReducer = <S> (initialState: S, actionClass: ActionClass<S>): Reducer<S, Action<S>> => {
  return (state: S = initialState, action: Action<any>) => {
    if (action instanceof actionClass) {
      return action.reduce(state);
    } else {
      return state;
    }
  };
};

// Creates a class that essentially acts as an abstract class for related actions that operate on the same slice of state.
export const createBaseActionClass = <S> (): ActionClass<S> => {
  return class extends Action<S> {
    constructor () {
      super();
    }

    reduce (state: S): S {
      // An action might never change the state, and only have sidecar activity.
      return state;
    }
  };
};

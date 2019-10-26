import {IFulfilledPromise, IPendingPromise, IPromiseBasedObservable, IRejectedPromise} from "mobx-utils";
import {UnreachableError} from "./Sanity";

export interface IUninitialisedPromise {
  state: "uninitialised";
  value: undefined;
}

export type WatchedPromise<V> = IUninitialisedPromise | IPendingPromise | IFulfilledPromise<V> | IRejectedPromise;

export const watchPromise = <V> (promise?: IPromiseBasedObservable<V>): WatchedPromise<V> =>
  !promise ? {
    state: "uninitialised",
    value: undefined,
  } : {
    state: promise.state,
    value: promise.value,
  };

export interface PromiseRenderers<V> {
  uninitialised?: () => JSX.Element;
  pending?: () => JSX.Element;
  fulfilled?: (value: V) => JSX.Element;
  rejected?: (error: any) => JSX.Element;
}

export const renderPromise = <V> (promise: WatchedPromise<V>, renderers: PromiseRenderers<V>): JSX.Element | undefined => {
  const renderer = renderers[promise.state] as any;
  if (!renderer) {
    return;
  }
  switch (promise.state) {
  case "uninitialised":
  case "pending":
    return renderer();
  case "fulfilled":
  case "rejected":
    return renderer(promise.value);
  default:
    throw new UnreachableError();
  }
};

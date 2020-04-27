import {runInAction} from 'mobx';
import {IFulfilledPromise, IPendingPromise, IPromiseBasedObservable, IRejectedPromise} from 'mobx-utils';
import {UnreachableError} from './Sanity';

export interface IUninitialisedPromise {
  state: 'uninitialised';
  value: undefined;
}

export type WatchedPromise<V> = IUninitialisedPromise | IPendingPromise | IFulfilledPromise<V> | IRejectedPromise;

export const watchPromise = <V> (promise: IPromiseBasedObservable<V> | undefined): WatchedPromise<V> =>
  !promise ? {
    state: 'uninitialised',
    value: undefined,
  } : {
    state: promise.state,
    value: promise.value,
  };

export const mapFulfilled = <V, R> (promise: WatchedPromise<V> | IPromiseBasedObservable<V> | undefined, mapper: (value: V) => R): R | undefined => {
  return promise?.state == 'fulfilled' ? mapper(promise.value) : undefined;
};

export const asyncResult = async <R> (promise: Promise<R>): Promise<[R, undefined] | [undefined, Error]> => {
  try {
    return [await promise, undefined];
  } catch (err) {
    return [undefined, err];
  }
};

export const createAtMostOnceAsyncFlowLock = () => ({nextRequestNo: 0});

export const createAtMostOneAsyncFlow = <T> (
  before: () => void,
  asyncValue: (...args: any[]) => Promise<T>,
  onFulfilled: (val: T) => void,
  onError: (val: Error) => void,
  cleanup: () => void,
  lock: { nextRequestNo: number } = createAtMostOnceAsyncFlowLock(),
) => {
  return async (...args: any[]) => {
    const requestNo = ++lock.nextRequestNo;
    runInAction(before);
    const [result, err] = await asyncResult(asyncValue(...args));
    if (requestNo != lock.nextRequestNo) {
      return;
    }
    if (err) {
      runInAction(() => onError(err));
    } else {
      runInAction(() => onFulfilled(result!));
    }
    runInAction(cleanup);
  };
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
  case 'uninitialised':
  case 'pending':
    return renderer();
  case 'fulfilled':
  case 'rejected':
    return renderer(promise.value);
  default:
    throw new UnreachableError();
  }
};

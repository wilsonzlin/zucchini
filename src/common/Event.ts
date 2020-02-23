import * as React from 'react';

export type EventHandler<E = undefined> = (event: E) => void;

export function callHandler<E extends undefined> (handler: EventHandler<E> | undefined): void;
export function callHandler<E> (handler: EventHandler<E> | undefined, event: E): void;
export function callHandler<E> (handler: EventHandler<E> | undefined, event?: E): void {
  // TODO HACK: It's possible that this function is called with an event handler for a non-undefined
  // event but undefined is provided as the event.
  handler && handler(event!);
}

export type MouseOrTouchEvent<T> = React.MouseEvent<T> | React.TouchEvent<T>;

export const isTouchEvent = function <T> (event: React.SyntheticEvent<T>): event is React.TouchEvent<T> {
  return (event as any).touches instanceof TouchList;
};

export const getMouseOrTouchX = (event: MouseOrTouchEvent<HTMLDivElement>) => {
  if (isTouchEvent(event)) {
    return event.touches[0].pageX;
  } else {
    return event.pageX;
  }
};

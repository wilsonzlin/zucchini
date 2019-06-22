export type EventHandler<E> = (event: E) => any;

export const callOptionalHandler = <E> (handler: EventHandler<E> | undefined, event: E): void => {
  if (handler) {
    return handler(event);
  }
};

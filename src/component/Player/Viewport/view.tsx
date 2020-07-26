import React from 'react';
import style from './style.scss';

export const PlayerViewport = ({
  element,
}: {
  element: HTMLElement | undefined;
}) => (
  <div className={style.container} ref={$container => {
    element && $container?.append(element);
  }}/>
);

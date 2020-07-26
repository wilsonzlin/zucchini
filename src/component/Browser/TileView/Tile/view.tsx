import {callHandler, EventHandler} from 'common/Event';
import React from 'react';
import style from './style.scss';

export const Tile = ({
  height,
  width,
  marginRight,

  name,
  thumbnailUrl,

  onClick,
}: {
  height: number;
  width: number;
  marginRight: number;

  name: string;
  thumbnailUrl?: string;

  onClick: EventHandler;
}) => (
  <div className={style.tile} onClick={() => callHandler(onClick)} style={{
    backgroundImage: thumbnailUrl && `url("${thumbnailUrl}")`,
    height: `${height}px`,
    width: `${width}px`,
    marginRight: `${marginRight}px`,
  }}>
    <div className={style.name}>{name}</div>
  </div>
);

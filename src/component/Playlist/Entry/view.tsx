import {callHandler, EventHandler} from 'common/Event';
import {File} from 'model/Listing';
import React from 'react';
import {IconButton} from 'ui/Button/view';
import {PlayIcon, TrashIcon} from 'ui/Icon/view';
import style from './style.scss';

export const PlaylistEntry = ({
  file,
  current,

  onPlay,
  onRemove,
}: {
  file: File;
  current: boolean;

  onPlay?: EventHandler<File>;
  onRemove?: EventHandler<File>;
}) => (
  <div className={style.entry} onClick={() => callHandler(onPlay, file)}>
    <div className={style.current}>{current && PlayIcon}</div>
    <div className={style.label}>
      <div className={style.title}>{file.title}</div>
      {/* TODO */}
      {/*<div className={style.subtitle}>{song.artists.join('; ')}</div>*/}
    </div>
    <div className={style.controls}>
      <IconButton className={style.delete} onClick={() => callHandler(onRemove, file)}>{TrashIcon}</IconButton>
    </div>
  </div>
);

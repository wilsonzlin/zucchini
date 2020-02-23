import {callHandler, EventHandler} from 'common/Event';
import 'component/Playlist/style.scss';
import {ISong} from 'model/Song';
import * as React from 'react';
import style from './style.scss';
import {IconButton} from '../../../ui/Button/view';
import {PlayIcon, TrashIcon} from '../../Icon/view';

export const PlaylistEntry = ({
  song,
  current,

  onPlay,
  onRemove,
}: {
  song: ISong;
  current: boolean;

  onPlay?: EventHandler<ISong>;
  onRemove?: EventHandler<ISong>;
}) => (
  <div className={style.entry} onClick={() => callHandler(onPlay, song)}>
    <div className={style.current}>{current && PlayIcon}</div>
    <div className={style.label}>
      <div className={style.title}>{song.title}</div>
      <div className={style.subtitle}>{song.artists.join('; ')}</div>
    </div>
    <div className={style.controls}>
      <IconButton className={style.delete} onClick={() => callHandler(onRemove, song)}>{TrashIcon}</IconButton>
    </div>
  </div>
);

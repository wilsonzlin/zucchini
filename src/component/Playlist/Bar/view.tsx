import React from 'react';
import {callHandler, EventHandler} from '../../../common/Event';
import {renderRepeatButton, renderShuffleButton} from '../common/controls';
import {RepeatMode, ShuffleMode} from '../state';
import style from './style.scss';

export const PlaylistBarView = ({
  playlist,

  repeatMode,
  shuffleMode,

  onToggleRepeat,
  onToggleShuffle,
  onClick,
}: {
  playlist: string;

  repeatMode: RepeatMode;
  shuffleMode: ShuffleMode;

  onToggleRepeat?: EventHandler<RepeatMode>;
  onToggleShuffle?: EventHandler<ShuffleMode>;
  onClick?: EventHandler;
}) => (
  <div className={style.bar}>
    <div className={style.playlist} onClick={onClick && (() => callHandler(onClick))}>{playlist}</div>
    <div>
      {renderRepeatButton(repeatMode, onToggleRepeat)}
      {renderShuffleButton(shuffleMode, onToggleShuffle)}
    </div>
  </div>
);

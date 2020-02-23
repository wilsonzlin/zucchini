import {callHandler, EventHandler} from '../../../common/Event';
import {RepeatMode, ShuffleMode} from '../state';
import React from 'react';
import {cls} from '../../../common/Classes';
import {IconButton} from '../../../ui/Button/view';
import {RepeatIcon, RepeatOnceIcon, ShuffleIcon} from '../../Icon/view';
import style from './controls.scss';

export const renderRepeatButton = (mode: RepeatMode, onToggle?: EventHandler<RepeatMode>) => {
  switch (mode) {
  case RepeatMode.OFF:
    return <IconButton className={cls(style.control, style.inactiveControl)}
                       onClick={() => callHandler(onToggle, RepeatMode.ALL)}>{RepeatIcon}</IconButton>;
  case RepeatMode.ALL:
    return <IconButton className={style.control} onClick={() => callHandler(onToggle, RepeatMode.ONE)}>{RepeatIcon}</IconButton>;
  case RepeatMode.ONE:
    return <IconButton className={style.control} onClick={() => callHandler(onToggle, RepeatMode.OFF)}>{RepeatOnceIcon}</IconButton>;
  }
};

export const renderShuffleButton = (mode: ShuffleMode, onToggle?: EventHandler<ShuffleMode>) => {
  switch (mode) {
  case ShuffleMode.OFF:
    return <IconButton className={cls(style.control, style.inactiveControl)}
                       onClick={() => callHandler(onToggle, ShuffleMode.ALL)}>{ShuffleIcon}</IconButton>;
  case ShuffleMode.ALL:
    return <IconButton className={style.control} onClick={() => callHandler(onToggle, ShuffleMode.OFF)}>{ShuffleIcon}</IconButton>;
  }
};

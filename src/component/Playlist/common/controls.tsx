import React from 'react';
import {cls} from '../../../common/Classes';
import {callHandler, EventHandler} from '../../../common/Event';
import {Button, IconButton} from '../../../ui/Button/view';
import {RepeatIcon, RepeatOnceIcon, ShuffleIcon} from '../../Icon/view';
import {RepeatMode, ShuffleMode} from '../state';
import style from './controls.scss';

export const renderRepeatButton = (mode: RepeatMode, onToggle?: EventHandler<RepeatMode>, label?: boolean) => {
  const ButtonImpl = label ? Button : IconButton;

  switch (mode) {
  case RepeatMode.OFF:
    return <ButtonImpl
      className={cls(style.control, style.inactiveControl)}
      onClick={() => callHandler(onToggle, RepeatMode.ALL)}
    >{RepeatIcon} {label && 'Repeat off'}</ButtonImpl>;

  case RepeatMode.ALL:
    return <ButtonImpl
      className={style.control}
      onClick={() => callHandler(onToggle, RepeatMode.ONE)}
    >{RepeatIcon} {label && 'Repeat all'}</ButtonImpl>;

  case RepeatMode.ONE:
    return <ButtonImpl
      className={style.control}
      onClick={() => callHandler(onToggle, RepeatMode.OFF)}
    >{RepeatOnceIcon} {label && 'Repeat one'}</ButtonImpl>;
  }
};

export const renderShuffleButton = (mode: ShuffleMode, onToggle?: EventHandler<ShuffleMode>, label?: boolean) => {
  const ButtonImpl = label ? Button : IconButton;

  switch (mode) {
  case ShuffleMode.OFF:
    return <ButtonImpl
      className={cls(style.control, style.inactiveControl)}
      onClick={() => callHandler(onToggle, ShuffleMode.ALL)}
    >{ShuffleIcon} {label && 'Shuffle off'}</ButtonImpl>;

  case ShuffleMode.ALL:
    return <ButtonImpl
      className={style.control}
      onClick={() => callHandler(onToggle, ShuffleMode.OFF)}
    >{ShuffleIcon} {label && 'Shuffle on'}</ButtonImpl>;
  }
};

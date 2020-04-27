import {cls} from 'common/DOM';
import {callHandler, EventHandler} from 'common/Event';
import React from 'react';
import style from './style.scss';

export const Input = ({
  className,
  placeholder,
  autocomplete,
  value,
  onKeyDown,
  onChange,
}: {
  className?: string;
  placeholder?: string;
  autocomplete?: string;
  value: string;
  onKeyDown?: EventHandler<React.KeyboardEvent<HTMLInputElement>>;
  onChange?: EventHandler<string>;
}) => {
  return (
    <input
      className={cls(style.input, className)}
      onKeyDown={onKeyDown}
      onChange={e => callHandler(onChange, e.target.value)}
      autoComplete={autocomplete}
      value={value}
      placeholder={placeholder}
    />
  );
};

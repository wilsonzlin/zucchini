import {cls} from 'common/Classes';
import {callHandler, EventHandler} from 'common/Event';
import * as React from 'react';
import style from './style.scss';

export interface ButtonProps {
  className?: string;
  children?: React.ReactNode;

  onClick?: EventHandler;
}

const BaseButton = ({
  className,
  children,
  onClick,
}: ButtonProps) => (
  <button
    className={cls(style.commonButton, className)}
    children={children}
    onClick={onClick && (() => callHandler(onClick))}
  />
);

export const Button = ({
  className,
  ...props
}: ButtonProps) => (
  <BaseButton className={cls(style.button, className)} {...props}/>
);

export const IconButton = ({
  className,
  ...props
}: ButtonProps) => (
  <BaseButton className={cls(style.iconButton, className)} {...props}/>
);

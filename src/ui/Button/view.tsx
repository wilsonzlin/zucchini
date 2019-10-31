import {cls} from "common/Classes";
import {callHandler, EventHandler} from "common/Event";
import * as React from "react";
import style from "./style.scss";

export interface ButtonProps {
  className?: string;
  children?: React.ReactNode;

  onClick?: EventHandler;
}

export const Button = (
  {
    className,
    children,

    onClick,
  }: ButtonProps
) => {
  return (
    <button
      className={cls(style.button, className)}
      children={children}
      onClick={onClick && (() => callHandler(onClick))}
    />
  );
};

export const IconButton = (
  {
    className,
    ...props
  }: ButtonProps
) => (
  <Button className={cls(className, style.iconButton)} {...props}/>
);

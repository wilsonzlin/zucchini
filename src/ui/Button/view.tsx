import {cls} from "common/Classes";
import {callHandler, EventHandler} from "common/Event";
import * as React from "react";
import style from "./style.scss";

export const Button = (
  {
    className,
    children,

    onClick,
  }: {
    className?: string;
    children?: React.ReactNode;

    onClick?: EventHandler;
  }
) => {
  return (
    <button
      className={cls(style.button, className)}
      children={children}
      onClick={onClick && (() => callHandler(onClick))}
    />
  );
};

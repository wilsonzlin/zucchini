import {cls} from "common/Classes";
import {callHandler, EventHandler} from "common/Event";
import React from "react";
import style from "./style.scss";

export const Input = (props: {
  className?: string;
  placeholder?: string;
  autocomplete?: string;
  value: string;

  onChange?: EventHandler<string>;
}) => {
  return (
    <input
      className={cls(style.input, props.className)}
      onChange={e => callHandler(props.onChange, e.target.value)}
      autoComplete={props.autocomplete}
      value={props.value}
      placeholder={props.placeholder}
    />
  );
};

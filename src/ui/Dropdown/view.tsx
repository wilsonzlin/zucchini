import {cls} from "common/Classes";
import {callHandler, EventHandler} from "common/Event";
import {assert} from "common/Sanity";
import React, {useState} from "react";
import {Dismissible} from "ui/Dismissible/view";
import style from "./style.scss";

export interface DropdownOption<V> {
  value: V;
  label: string;
}

interface Props<V> {
  className?: string;

  value: V;
  options: DropdownOption<V>[];

  onChange?: EventHandler<V>;
}

export function Dropdown<V> (props: Props<V>) {
  assert(props.options.length > 0);
  const [showing, setShowing] = useState(false);
  const {value, options, onChange} = props;
  const label = (options.find(o => o.value === value) || options[0]).label;

  return (
    <div className={cls(style.container, props.className, showing && style.showing)}>
      <button
        type="button"
        className={style.value}
        onClick={() => setShowing(!showing)}
      >
        <span className={style.valueText}>{label}</span>
        <span className={style.arrow}/>
      </button>
      <Dismissible
        className={style.menu}
        hidden={!showing}
        onDismiss={() => setShowing(false)}
      >
        {options.map((o, i) => (
          <button
            key={i}
            className={style.option}
            type="button"
            onClick={() => {
              setShowing(false);
              callHandler(onChange, o.value);
            }}>
            {o.label}
          </button>
        ))}
      </Dismissible>
    </div>
  );
}

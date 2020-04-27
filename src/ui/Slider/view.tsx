import {cls} from 'common/DOM';
import {callHandler, EventHandler} from 'common/Event';
import React from 'react';
import style from './style.scss';

export const Slider = ({
  className,
  min,
  max,
  step,
  value,
  onChange,
}: {
  className?: string;
  min: number;
  max: number;
  step?: number;
  // Indeterminate if value is undefined.
  value?: number;
  onChange?: EventHandler<number>;
}) => (
  <div className={cls(
    style.container,
    className,
    value == undefined && style.loading,
  )}>
    <div className={style.track}/>
    <div
      className={style.value}
      style={value == undefined ? undefined : {width: `${value / max * 100}%`}}
    />
    <input
      className={style.input}
      type="range"
      min={min}
      max={max}
      step={step}
      // Make sure to always have a value, otherwise React will complain that it changes between uncontrolled and controlled.
      value={value ?? min}
      onChange={e => callHandler(onChange, +e.target.value)}
    />
  </div>
);

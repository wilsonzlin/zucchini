import {cls} from 'common/Classes';
import {callHandler, EventHandler} from 'common/Event';
import * as React from 'react';
import style from './style.scss';

export const Slider = (
  props: {
    className?: string;
    min: number;
    max: number;
    step?: number;
    // TODO Indeterminate if undefined
    value?: number;
    onChange?: EventHandler<number>;
  },
) => (
  <div className={cls(
    style.container,
    props.className,
    props.value == undefined && style.loading,
  )}>
    <div className={style.track}/>
    <div
      className={style.value}
      style={props.value == undefined
        ? undefined
        : {width: `${props.value / props.max * 100}%`}}
    />
    <input className={style.input}
           type="range"
           min={props.min}
           max={props.max}
           step={props.step}
           value={props.value}
           onChange={e => callHandler(props.onChange, +e.target.value)}
    />
  </div>
);

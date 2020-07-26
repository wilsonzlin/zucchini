import {callHandler, EventHandler} from 'common/Event';
import {assertState} from 'extlib/js/assert/assert';
import {cls} from 'extlib/js/dom/classname';
import React, {ReactNode} from 'react';
import {useDismissible} from 'ui/util/dismissible';
import {BlockArrowDownIcon, BlockArrowUpIcon} from '../Icon/view';
import style from './style.scss';

export interface DropdownOption<V> {
  value: V;
  label: ReactNode;
}

export function Dropdown<V> ({
  className,
  value,
  options,
  onChange,
}: {
  className?: string;
  value: V;
  options: DropdownOption<V>[];
  onChange?: EventHandler<V>;
}) {
  assertState(options.length > 0);
  const [showing, setShowing, onRelevantClick, onRelevantFocus] = useDismissible();
  const label = (options.find(o => o.value === value) || options[0]).label;

  return (
    <div
      className={cls(style.container, className, showing && style.showing)}
      onClick={() => onRelevantClick()}
    >
      <button
        type="button"
        className={style.value}
        onClick={() => setShowing(!showing)}
      >
        <span className={style.valueText}>{label}</span>
        <span className={style.arrow}>{showing ? BlockArrowUpIcon : BlockArrowDownIcon}</span>
      </button>
      <div
        className={style.menu}
        hidden={!showing}
        onFocusCapture={onRelevantFocus}
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
      </div>
    </div>
  );
}

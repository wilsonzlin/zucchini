import {callHandler, EventHandler} from 'common/Event';
import {cls} from 'extlib/js/dom/classname';
import React, {useState} from 'react';
import style from './style.scss';

// Where the card should anchor to. For example, if TOP,
// then the card will show above the content.
export const enum HoverCardAnchor {
  TOP,
  BOTTOM,
  LEFT,
  RIGHT,
}

const anchorClass: { [a in HoverCardAnchor]: string } = {
  [HoverCardAnchor.TOP]: style.anchorTop,
  [HoverCardAnchor.BOTTOM]: style.anchorBottom,
  [HoverCardAnchor.LEFT]: style.anchorLeft,
  [HoverCardAnchor.RIGHT]: style.anchorRight,
};

export const HoverCard = ({
  anchor,
  children,
  className,
  onClick,
  visible,
}: {
  anchor: HoverCardAnchor;
  children?: React.ReactNode;
  className?: string;
  onClick?: EventHandler;
  visible: boolean;
}) => {
  const [hoveringSelf, setHoveringSelf] = useState(false);

  return (
    <div
      hidden={!hoveringSelf && !visible}
      className={cls(style.card, className, anchorClass[anchor])}
      onMouseEnter={() => setHoveringSelf(true)}
      onMouseLeave={() => setHoveringSelf(false)}
      onClick={() => callHandler(onClick)}
    >
      {children}
    </div>
  );
};

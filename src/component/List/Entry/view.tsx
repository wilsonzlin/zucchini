import {cls} from 'common/Classes';
import {callHandler, EventHandler} from 'common/Event';
import {Field, ISong} from 'model/Song';
import * as React from 'react';
import {useState} from 'react';
import commonStyle from '../common/style.scss';
import style from './style.scss';

export interface ColumnDefinition<F extends Field> {
  field: F;
  label: string;
  width: number;
  align?: 'left' | 'center' | 'right';
}

export const ListEntry = ({
  song,
  columns,

  onPlayTrack,
}: {
  song: ISong;
  columns: ColumnDefinition<Field>[];

  onPlayTrack?: EventHandler<ISong>;
}) => {
  const [hoveringExceptOnLink, setHoveringExceptOnLink] = useState(false);
  return (
    <tr
      className={cls({
        [style.entry]: true,
        [style.hovering]: hoveringExceptOnLink,
      })}
      onClick={() => hoveringExceptOnLink && callHandler(onPlayTrack, song)}
      onMouseEnter={e => setHoveringExceptOnLink(!(e.target instanceof HTMLAnchorElement))}
      onMouseLeave={() => setHoveringExceptOnLink(false)}
    >
      {columns.map(c => <td
        key={c.field}
        className={commonStyle.cell}
        style={{textAlign: c.align}}
        // TODO
      >{([].concat(song[c.field] as any)).join('; ')}</td>)}
    </tr>
  );
};

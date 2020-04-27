import {cls} from 'common/DOM';
import {callHandler, EventHandler} from 'common/Event';
import React, {useState} from 'react';
import {MediaFile} from '../../../model/Media';
import commonStyle from '../common/style.scss';
import {ListViewColumnDefinition} from '../state';
import style from './style.scss';

export const ListEntry = ({
  file,
  columns,
  onRequestPlayFile,
}: {
  file: MediaFile;
  columns: ListViewColumnDefinition[];

  onRequestPlayFile?: EventHandler;
}) => {
  const [hoveringExceptOnLink, setHoveringExceptOnLink] = useState(false);
  return (
    <tr
      className={cls({
        [style.entry]: true,
        [style.hovering]: hoveringExceptOnLink,
      })}
      onClick={() => hoveringExceptOnLink && callHandler(onRequestPlayFile)}
      onMouseEnter={e => setHoveringExceptOnLink(!(e.target instanceof HTMLAnchorElement))}
      onMouseLeave={() => setHoveringExceptOnLink(false)}
    >
      {columns.map(c => (
        <td
          key={c.field}
          className={commonStyle.cell}
          style={{textAlign: c.align}}
          // TODO
        >
          {file.metadata[c.field]}
        </td>
      ))}
    </tr>
  );
};

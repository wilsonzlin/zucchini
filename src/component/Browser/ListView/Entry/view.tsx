import {callHandler, EventHandler} from 'common/Event';
import {cls} from 'extlib/js/dom/classname';
import {File} from 'model/Listing';
import React, {useState} from 'react';
import commonStyle from '../common/style.scss';
import {ListViewColumnDefinition} from '../config';
import style from './style.scss';

export const ListEntry = ({
  file,
  columns,
  onRequestPlayFile,
}: {
  file: File;
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

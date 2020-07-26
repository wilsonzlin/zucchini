import {callHandler, EventHandler} from 'common/Event';
import {cls} from 'extlib/js/dom/classname';
import {File, isDel, isFile, isNotDir, Listing} from 'model/Listing';
import React from 'react';
import {Button} from 'ui/Button/view';
import commonStyle from './common/style.scss';
import {Columns, ListViewColumnDefinition} from './config';
import {ListEntry} from './Entry/view';
import style from './style.scss';

const MessageBody = ({
  cellClassName,
  message,
}: {
  cellClassName?: string;
  message: string;
}) => (
  <tbody>
    <tr>
      <td className={cls(style.messageCell, cellClassName)} colSpan={Number.MAX_SAFE_INTEGER}>{message}</td>
    </tr>
  </tbody>
);

export const ListView = ({
  columns,
  entries,
  approximateCount,
  approximateDuration,
  approximateSize,
  hasContinuation,

  onRequestPlayFiles,
}: {
  columns: ListViewColumnDefinition[];
  entries: Listing[];
  approximateCount?: number;
  approximateDuration?: number;
  approximateSize?: number;
  hasContinuation: boolean;

  onRequestPlayFiles?: EventHandler<[File[], File]>;
}) => (
  <table className={style.list}>
    <thead>
      <tr>
        {/* In table-layout: fixed, first column determines widths, so set first row width style. */}
        {columns.map(c => (
          <th
            key={c.field}
            className={cls(style.headingCell, commonStyle.cell)}
            style={{width: `${c.width}%`, textAlign: c.align}}
          >
            {c.label}
          </th>
        ))}
      </tr>
    </thead>

    <tbody>
      {entries.filter(isNotDir).map(f => isDel(f) ? (
        <tr key={`groupDelimiter:${f.title}`}>
          <th className={style.subgroupTitleCell} colSpan={Number.MAX_SAFE_INTEGER}>
            <div className={style.subgroupTitleContent}>
              <div>{f.title}</div>
              <div><Button>Play all</Button></div>
            </div>
          </th>
        </tr>
      ) : (
        <ListEntry columns={Columns} file={f} onRequestPlayFile={() => callHandler(onRequestPlayFiles, [entries.filter(isFile), f])}/>
      ))}
    </tbody>
  </table>
);

import {cls} from 'common/DOM';
import {callHandler, EventHandler} from 'common/Event';
import {Columns} from 'component/ListView/config';
import {ListEntry} from 'component/ListView/Entry/view';
import React from 'react';
import {MediaFile} from '../../model/Media';
import {GroupDelimiter} from '../../model/Playlist';
import {Button} from '../../ui/Button/view';
import commonStyle from './common/style.scss';
import {ListViewColumnDefinition} from './state';
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

export const List = ({
  columns,
  entries,
  loading,
  error,
  approximateCount,
  approximateDuration,
  approximateSize,
  hasContinuation,

  onRequestPlayFiles,
}: {
  columns: ListViewColumnDefinition[];
  entries: (GroupDelimiter | MediaFile)[];
  loading: boolean;
  error?: string;
  approximateCount?: number;
  approximateDuration?: number;
  approximateSize?: number;
  hasContinuation: boolean;

  onRequestPlayFiles?: EventHandler<MediaFile[]>;
}) => (
  <div className={cls({
    [style.container]: true,
    [style.isLoading]: loading,
  })}>
    <div className={style.loadingContainer}>
      <div className={style.loadingBar}/>
    </div>

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

      {loading ? (
        <MessageBody cellClassName={style.loadingCell} message="Loading..."/>
      ) : error !== undefined ? (
        <MessageBody message={`Error: ${error}`}/>
      ) : (
        <tbody>
          {entries.map(f => f instanceof GroupDelimiter ? (
            <tr key={`groupDelimiter:${f.title}`}>
              <th className={style.subgroupTitleCell} colSpan={Number.MAX_SAFE_INTEGER}>
                <div className={style.subgroupTitleContent}>
                  <div>{f.title}</div>
                  <div><Button>Play all</Button></div>
                </div>
              </th>
            </tr>
          ) : (
            <ListEntry columns={Columns} file={f} onRequestPlayFile={() => callHandler(onRequestPlayFiles, [f])}/>
          ))}
        </tbody>
      )}
    </table>
  </div>
);

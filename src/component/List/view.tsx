import {renderPromise, WatchedPromise} from 'common/Async';
import {cls} from 'common/Classes';
import {callHandler, EventHandler} from 'common/Event';
import {Columns} from 'component/List/config';
import {ColumnDefinition, ListEntry} from 'component/List/Entry/view';
import {IGroup, ISubgroup, Listing} from 'component/Organiser/state';
import {Field, ISong} from 'model/Song';
import React from 'react';
import {Button} from '../../ui/Button/view';
import commonStyle from './common/style.scss';
import style from './style.scss';

const SongEntry = ({
  song,
  onPlay,
}: {
  song: ISong;
  onPlay?: EventHandler<ISong>;
}) => (
  <ListEntry
    song={song}
    columns={Columns}
    onPlayTrack={onPlay}
  />
);

const renderSubgroupRows = ({
  field,
  name,
  songs,
  onPlayTracks,
}: ISubgroup & {
  onPlayTracks?: EventHandler<ISong[]>,
}) => [
  field && <tr key={`subgroup-title:${field}|${name}`}>
    <th className={style.subgroupTitleCell} colSpan={Number.MAX_SAFE_INTEGER}>
      <div className={style.subgroupTitleContent}>
        <div>{name}</div>
        <div><Button onClick={() => callHandler(onPlayTracks, songs)}>Play all</Button></div>
      </div>
    </th>
  </tr>,
  ...songs.map(s => <SongEntry key={`song:${s.file}`} song={s} onPlay={s => callHandler(onPlayTracks, [s])}/>),
];

const renderGroupRows = ({
  field,
  name,
  subgroups,
  onPlayTracks,
}: IGroup & {
  onPlayTracks?: EventHandler<ISong[]>,
}) => [
  field && <tr key={`group:${field}|${name}`}>
    <th className={style.groupTitleCell} colSpan={Number.MAX_SAFE_INTEGER}>
      <div className={style.groupTitleContent}>
        <div>{name}</div>
        <div><Button onClick={() => callHandler(onPlayTracks, subgroups.flatMap(sg => sg.songs))}>Play all</Button></div>
      </div>
    </th>
  </tr>,
  ...subgroups.map(sg => renderSubgroupRows({...sg, onPlayTracks})),
];

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

export interface LibraryProps {
  columns: ColumnDefinition<Field>[];
  listing: WatchedPromise<Listing>;

  onPlayTracks?: EventHandler<ISong[]>;
}

export const List = ({
  columns,
  listing,

  onPlayTracks,
}: LibraryProps) => {
  const body = renderPromise(listing, {
    uninitialised: () => <MessageBody message="No library chosen"/>,
    pending: () => <MessageBody cellClassName={style.loadingCell} message="Loading..."/>,
    fulfilled: listing => <tbody>{listing.groups.map(g => renderGroupRows({...g, onPlayTracks}))}</tbody>,
    rejected: err => <MessageBody message={`Error: ${err.message}`}/>,
  });

  return (
    <div className={cls({
      [style.container]: true,
      [style.isLoading]: listing.state == 'pending',
    })}>
      <div className={style.loadingContainer}>
        <div className={style.loadingBar}/>
      </div>

      <table className={style.list}>
        <thead>
          <tr>
            {/* In table-layout: fixed, first column determines widths, so set first row width style. */}
            {columns.map(c => <th
              key={c.field}
              className={cls(style.headingCell, commonStyle.cell)}
              style={{width: `${c.width}%`, textAlign: c.align}}
            >{c.label}</th>)}
          </tr>
        </thead>
        {body}
      </table>
    </div>
  );
};

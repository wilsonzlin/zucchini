import {renderPromise, WatchedPromise} from 'common/Async';
import {cls} from 'common/Classes';
import {callHandler, EventHandler} from 'common/Event';
import {assertExists} from 'common/Sanity';
import {Columns} from 'component/List/config';
import {ColumnDefinition, ListEntry} from 'component/List/Entry/view';
import {IGroup, ISubgroup, Listing} from 'component/Organiser/state';
import {Field, ISong} from 'model/Song';
import * as React from 'react';
import commonStyle from './common/style.scss';
import style from './style.scss';
import {FieldIcon} from '../Icon/config';
import {Button} from '../../ui/Button/view';

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

const Subgroup = ({
  field,
  name,
  songs,
  onPlayTracks,
}: ISubgroup & {
  onPlayTracks?: EventHandler<ISong[]>,
}) => (
  <React.Fragment>
    {field && (<tbody>
      <tr>
        <th className={style.groupTitleCell} colSpan={Number.MAX_SAFE_INTEGER}>
          <div className={style.groupTitleCellContent}>
            <div>{FieldIcon[field]} {assertExists(name)}</div>
            <div><Button onClick={() => callHandler(onPlayTracks, songs)}>Play all</Button></div>
          </div>
        </th>
      </tr>
    </tbody>)}
    <tbody>
      {songs.map(s => <SongEntry key={s.file} song={s} onPlay={s => callHandler(onPlayTracks, [s])}/>)}
    </tbody>
  </React.Fragment>
);

const Group = ({
  field,
  name,
  subgroups,
  onPlayTracks,
}: IGroup & {
  onPlayTracks?: EventHandler<ISong[]>,
}) => (
  <React.Fragment>
    {field && name && <tbody>
      <tr>
        <th className={style.groupTitleCell} colSpan={Number.MAX_SAFE_INTEGER}>
          <div className={style.groupTitleCellContent}>
            <div>{FieldIcon[field]} {assertExists(name)}</div>
            <div><Button onClick={() => callHandler(onPlayTracks, subgroups.flatMap(sg => sg.songs))}>Play all</Button></div>
          </div>
        </th>
      </tr>
    </tbody>}
    {subgroups.map(sg => <Subgroup key={`subgroup:${sg.field}|${sg.name}`} {...sg} onPlayTracks={onPlayTracks}/>)}
  </React.Fragment>
);

const MessageBody = (props: {
  cellClassName?: string;
  message: string;
}) => (
  <tbody>
    <tr>
      <td className={cls(style.messageCell, props.cellClassName)} colSpan={Number.MAX_SAFE_INTEGER}>{props.message}</td>
    </tr>
  </tbody>
);

export interface LibraryProps {
  columns: ColumnDefinition<Field>[];
  listing: WatchedPromise<Listing>;

  onPlayTracks?: EventHandler<ISong[]>;
}

export const List = (
  {
    columns,
    listing,

    onPlayTracks,
  }: LibraryProps,
) => {
  const body = renderPromise(listing, {
    uninitialised: () => <MessageBody message="No library chosen"/>,
    pending: () => <MessageBody cellClassName={style.loadingCell} message="Loading..."/>,
    fulfilled: listing => <>{listing.groups.map(g => <Group key={`group:${g.field}|${g.name}`} {...g} onPlayTracks={onPlayTracks}/>)}</>,
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
            {/* In table-layout: fixed, first column determines widths,
             so set first row width style. */}
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

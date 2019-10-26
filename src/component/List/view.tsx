import {renderPromise, WatchedPromise} from "common/Async";
import {cls} from "common/Classes";
import {EventHandler} from "common/Event";
import {UnreachableError} from "common/Sanity";
import {Columns} from "component/List/config";
import {ColumnDefinition, ListEntry} from "component/List/Entry/view";
import {GroupedSongs, Listing, SubgroupedSongs} from "component/Organiser/state";
import {Field, Song} from "model/Song";
import * as React from "react";
import commonStyle from "./common/style.scss";
import style from "./style.scss";

const Songs = (props: { songs: Song[], onPlayTrack?: EventHandler<Song> }) => (
  <tbody>
    {props.songs.map(s => <ListEntry
      key={s.file}
      song={s}
      columns={Columns}
      onPlayTrack={props.onPlayTrack}
    />)}
  </tbody>
);

const GroupedSongs = (props: { group: GroupedSongs, onPlayTrack?: EventHandler<Song> }) => (
  <React.Fragment key={`${props.group.field}\0${props.group.name}`}>
    <tbody>
      <tr>
        <th colSpan={Number.MAX_SAFE_INTEGER}>{props.group.field}: {props.group.name}</th>
      </tr>
    </tbody>
    <Songs songs={props.group.songs} onPlayTrack={props.onPlayTrack}/>
  </React.Fragment>
);

const SubgroupedSongs = (props: { subgroups: SubgroupedSongs, onPlayTrack?: EventHandler<Song> }) => (
  <React.Fragment key={`${props.subgroups.field}\0${props.subgroups.name}`}>
    <tbody>
      <tr>
        <th colSpan={Number.MAX_SAFE_INTEGER}>{props.subgroups.field}: {props.subgroups.name}</th>
      </tr>
    </tbody>
    {props.subgroups.subgroups.map(sg => <GroupedSongs
      group={sg}
      onPlayTrack={props.onPlayTrack}
    />)}
  </React.Fragment>
);

const MessageBody = (props: { message: string }) => (
  <tbody>
    <tr>
      <td>{props.message}</td>
    </tr>
  </tbody>
);

export interface LibraryProps {
  columns: ColumnDefinition<Field>[];
  listing: WatchedPromise<Listing>;

  onPlayTrack?: EventHandler<Song>;
}

export const Library = (
  {
    columns,
    listing,

    onPlayTrack,
  }: LibraryProps
) => {
  const body = renderPromise(listing, {
    uninitialised: () => <MessageBody message="No library chosen"/>,
    pending: () => <MessageBody message="Loading..."/>,
    fulfilled: listing => {
      switch (listing.type) {
      case "single":
        return <Songs songs={listing.units} onPlayTrack={onPlayTrack}/>;
      case "grouped":
        return <>{listing.units.map(g => <GroupedSongs group={g} onPlayTrack={onPlayTrack}/>)}</>;
      case "subgrouped":
        return <>{listing.units.map(g => <SubgroupedSongs subgroups={g} onPlayTrack={onPlayTrack}/>)}</>;
      default:
        throw new UnreachableError();
      }
    },
    rejected: err => <MessageBody message={`Error: ${err.message}`}/>,
  });

  return (
    <div className={cls({
      [style.container]: true,
      [style.isLoading]: listing.state == "pending",
    })}>
      <div className={style.loadingContainer}>
        <div className={style.loadingBar}/>
      </div>

      <table className={style.list}>
        <thead>
        </thead>

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

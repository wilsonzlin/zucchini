import {callHandler, EventHandler} from "common/Event";
import "component/Playlist/style.scss";
import {Song} from "model/Song";
import * as React from "react";

export interface PlaylistEntryProps {
  song: Song;
  playing: boolean;

  onPlay?: EventHandler<Song>;
  onRemove?: EventHandler<Song>;
}

export const PlaylistEntry = (props: PlaylistEntryProps) => (
  <div className="playlist-entry" data-playing={props.playing}>
    <div className="playlist-entry-text-container"
         onClick={() => callHandler(props.onPlay, props.song)}>
      <div className="playlist-entry-title">{props.song.title}</div>
      <div className="playlist-entry-subtitle">{props.song.artists[0]} &mdash; {props.song.album}</div>
    </div>

    <div className="flex-spacer"/>

    <div>
      <button className="playlist-entry-delete-button"
              onClick={() => callHandler(props.onRemove, props.song)}>&times;</button>
    </div>
  </div>
);

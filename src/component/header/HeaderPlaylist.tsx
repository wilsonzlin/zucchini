import * as React from "react";
import {callOptionalHandler, EventHandler} from "../../common/Event";
import {Song} from "../../common/Media";
import "./HeaderPlaylist.scss";

export interface PlaylistEntryPlayEvent {
  song: Song;
}

export interface PlaylistEntryRemoveEvent {
  song: Song;
}

export interface PlaylistEntryProps {
  song: Song;
  playing: boolean;

  onPlay?: EventHandler<PlaylistEntryPlayEvent>;
  onRemove?: EventHandler<PlaylistEntryRemoveEvent>;
}

export const PlaylistEntry = (props: PlaylistEntryProps) => (
  <div className="playlist-entry" data-playing={props.playing}>
    <div className="playlist-entry-text-container"
         onClick={() => callOptionalHandler(props.onPlay, {song: props.song})}>
      <div className="playlist-entry-title">{props.song.title}</div>
      <div className="playlist-entry-subtitle">{props.song.artists[0]} &mdash; {props.song.album}</div>
    </div>

    <div className="flex-spacer"/>

    <div>
      <button className="playlist-entry-delete-button"
              onClick={() => callOptionalHandler(props.onRemove, {song: props.song})}>&times;</button>
    </div>
  </div>
);

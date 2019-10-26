import * as React from "react";
import {callHandler, EventHandler} from "common/Event";
import "component/Playlist/Toggle/style.scss";

export interface PlaylistToggleClickEvent {
}

export interface PlaylistToggleProps {
  onClick?: EventHandler<PlaylistToggleClickEvent>;
}

export const PlaylistToggle = (props: PlaylistToggleProps) => (
  <button className="playlist-toggle" onClick={e => callHandler(props.onClick, {})}/>
);

import * as React from "react";
import {callOptionalHandler, EventHandler} from "../../common/Event";
import "./PlaylistToggle.scss";

export interface PlaylistToggleClickEvent {
}

export interface PlaylistToggleProps {
  onClick?: EventHandler<PlaylistToggleClickEvent>;
}

export const PlaylistToggle = (props: PlaylistToggleProps) => (
  <button className="playlist-toggle" onClick={e => callOptionalHandler(props.onClick, {})}/>
);

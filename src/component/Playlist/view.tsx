import {callHandler, EventHandler} from "common/Event";
import {PlaylistEntry, PlaylistEntryProps} from "component/Playlist/Entry/view";
import * as React from "react";
import {RepeatMode, ShuffleMode} from "../Player/state";
import * as style from "./style.scss";

export interface HeaderToggleRepeatEvent {
  mode: RepeatMode;
}

export interface HeaderToggleShuffleEvent {
  mode: ShuffleMode;
}

export interface HeaderPlaylistClearEvent {
}

export interface HeaderPlaylistProps {
  songs: PlaylistEntryProps[];
  visible: boolean;

  repeatMode: RepeatMode;
  shuffleMode: ShuffleMode;

  onToggleRepeat?: EventHandler<HeaderToggleRepeatEvent>;
  onToggleShuffle?: EventHandler<HeaderToggleShuffleEvent>;
  onClear?: EventHandler<HeaderPlaylistClearEvent>;
}

export class Playlist extends React.Component<HeaderPlaylistProps> {
  render () {
    return (
      <div className={style.playlist}>
        <select>
          <option defaultChecked={true}>Now playing</option>
          <option disabled={true}>---</option>
          <option>Playlist1</option>
        </select>
        <div id="playlist-controls">
          <button id="repeat-one-button" onClick={() => this.handleToggleRepeat(RepeatMode.ONE)}>Repeat one</button>
          <button id="repeat-all-button" onClick={() => this.handleToggleRepeat(RepeatMode.ALL)}>Repeat all</button>
          <button id="shuffle-button" onClick={() => this.handleToggleShuffle(ShuffleMode.ALL)}>Shuffle</button>
          <div className="flex-spacer"/>
          <button onClick={() => callHandler(this.props.onClear, {})}>Clear</button>
        </div>
        <div id="playlist-queue"
        >{this.props.songs.map(
          e => <PlaylistEntry {...e}/>
        )}</div>
      </div>
    );
  }

  private handleToggleRepeat = (to: RepeatMode) => {
    callHandler(this.props.onToggleRepeat, {mode: this.props.repeatMode == to ? RepeatMode.OFF : to});
  };

  private handleToggleShuffle (to: ShuffleMode) {
    callHandler(this.props.onToggleShuffle, {mode: this.props.shuffleMode == to ? ShuffleMode.OFF : to});
  }
}

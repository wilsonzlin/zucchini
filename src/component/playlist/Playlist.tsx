import {RepeatMode, ShuffleMode} from "../../common/Media";
import {callOptionalHandler, EventHandler} from "../../common/Event";
import {PlaylistEntry, PlaylistEntryProps} from "./PlaylistEntry";
import * as React from "react";
import {AppState} from "../../state/AppState";
import {GlobalDispatcher} from "../../common/Action";
import {connect} from "react-redux";

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

const mapStateToProps = (state: AppState) => ({
  songs: state.playlist.songs,
  visible: state.playlist.visible,

  repeatMode: state.player.repeatMode,
  shuffleMode: state.player.shuffleMode,
});

const mapDispatchToProps = (dispatch: GlobalDispatcher) => ({});

export const Playlist = connect(mapStateToProps, mapDispatchToProps)(
  class extends React.Component<HeaderPlaylistProps> {
    constructor (props: HeaderPlaylistProps) {
      super(props);
    }

    render () {
      return (
        <div id="playlist-menu">
          <div id="playlist-controls">
            <button id="repeat-one-button" onClick={() => this.handleToggleRepeat(RepeatMode.ONE)}>Repeat one</button>
            <button id="repeat-all-button" onClick={() => this.handleToggleRepeat(RepeatMode.ALL)}>Repeat all</button>
            <button id="shuffle-button" onClick={() => this.handleToggleShuffle(ShuffleMode.ALL)}>Shuffle</button>
            <div className="flex-spacer"/>
            <button onClick={() => callOptionalHandler(this.props.onClear, {})}>Clear</button>
          </div>
          <div id="playlist-queue"
          >{this.props.songs.map(
            e => <PlaylistEntry {...e}/>
          )}</div>
        </div>
      );
    }

    private handleToggleRepeat = (to: RepeatMode) => {
      callOptionalHandler(this.props.onToggleRepeat, {mode: this.props.repeatMode == to ? RepeatMode.OFF : to});
    };

    private handleToggleShuffle (to: ShuffleMode) {
      callOptionalHandler(this.props.onToggleShuffle, {mode: this.props.shuffleMode == to ? ShuffleMode.OFF : to});
    }
  }
);

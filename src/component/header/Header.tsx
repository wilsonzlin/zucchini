import {callOptionalHandler, EventHandler} from "../../common/Event";
import * as React from "react";
import "./Header.scss";
import {PlaylistEntry, PlaylistEntryPlayEvent, PlaylistEntryProps, PlaylistEntryRemoveEvent} from "./HeaderPlaylist";
import {RepeatMode, ShuffleMode} from "../../common/Media";
import {AppState} from "../../state/AppState";
import {connect} from "react-redux";
import {HeaderSearch} from "./HeaderSearch";
import {GlobalDispatcher} from "../../common/Action";

export interface HeaderToggleMenuEvent {
}

export interface HeaderToggleRepeatEvent {
  mode: RepeatMode;
}

export interface HeaderToggleShuffleEvent {
  mode: ShuffleMode;
}

export interface HeaderPlaylistClearEvent {
}

export interface HeaderProps {
  playlist: PlaylistEntryProps[];
  repeatMode: RepeatMode;
  shuffleMode: ShuffleMode;
  playlistVisible: boolean;

  onTogglePlaylist?: EventHandler<HeaderToggleMenuEvent>;
  onToggleRepeat?: EventHandler<HeaderToggleRepeatEvent>;
  onToggleShuffle?: EventHandler<HeaderToggleShuffleEvent>;
  onClear?: EventHandler<HeaderPlaylistClearEvent>;
  onEntryPlay?: EventHandler<PlaylistEntryPlayEvent>;
  onEntryRemove?: EventHandler<PlaylistEntryRemoveEvent>;
}

const mapStateToProps = (state: AppState) => ({
  repeatMode: state.player.repeatMode,
  shuffleMode: state.player.shuffleMode,
});

const mapDispatchToProps = (dispatch: GlobalDispatcher) => ({});

export const Header = connect(mapStateToProps, mapDispatchToProps)(
  class extends React.Component<HeaderProps> {
    constructor (props: HeaderProps) {
      super(props);
    }

    private handleTogglePlaylist = (event: React.MouseEvent<HTMLButtonElement>) => {
      callOptionalHandler(this.props.onTogglePlaylist, {});
    };

    private handleToggleRepeat = (to: RepeatMode) => {
      callOptionalHandler(this.props.onToggleRepeat, {mode: this.props.repeatMode == to ? RepeatMode.OFF : to});
    };

    private handleToggleShuffle (to: ShuffleMode) {
      callOptionalHandler(this.props.onToggleShuffle, {mode: this.props.shuffleMode == to ? ShuffleMode.OFF : to});
    }

    render () {
      return (
        <header>
          <div id="app-branding">
            <span id="app-logo">w.l</span>
            <h1 id="app-title">Music</h1>
          </div>

          <HeaderSearch/>

          <button id="playlist-toggle" onClick={this.handleTogglePlaylist}/>
          <div id="playlist-menu">
            <div id="playlist-controls">
              <button id="repeat-one-button" onClick={() => this.handleToggleRepeat(RepeatMode.ONE)}>Repeat one</button>
              <button id="repeat-all-button" onClick={() => this.handleToggleRepeat(RepeatMode.ALL)}>Repeat all</button>
              <button id="shuffle-button" onClick={() => this.handleToggleShuffle(ShuffleMode.ALL)}>Shuffle</button>
              <div className="flex-spacer"/>
              <button onClick={() => callOptionalHandler(this.props.onClear, {})}>Clear</button>
            </div>
            <div id="playlist-queue"
            >{this.props.playlist.map(
              e => <PlaylistEntry onPlay={this.props.onEntryPlay} onRemove={this.props.onEntryRemove} {...e}/>
            )}</div>
          </div>
        </header>
      );
    }
  });

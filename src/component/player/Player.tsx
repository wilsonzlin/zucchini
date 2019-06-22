import {callOptionalHandler, EventHandler} from "../../common/Event";
import * as React from "react";
import {minMax} from "../../common/Util";
import "./Player.scss";
import {AppState} from "../../state/AppState";
import {connect} from "react-redux";
import {GlobalDispatcher} from "../../common/Action";
import {OptionalAlbumName, OptionalArtistName, OptionalTitleName} from "../../common/Media";
import {
  playerChangeVolumeThunk,
  playerPlayOrPauseThunk,
  playerSeekThunk,
  playerToggleMuteThunk
} from "../../state/PlayerState";

export interface PlayerTogglePlaybackEvent {
  playing: boolean;
}

export interface PlayerPreviousEvent {
}

export interface PlayerNextEvent {
}

export interface PlayerSeekEvent {
  progress: number;
}

export interface PlayerToggleMuteEvent {
  mute: boolean;
}

export interface PlayerVolumeChangeEvent {
  volume: number;
}

export interface PlayerProps {
  loading: boolean;
  playing: boolean;
  hasSource: boolean;

  artist: OptionalArtistName;
  album: OptionalAlbumName;
  title: OptionalTitleName;
  duration: number;

  progress: number;
  volume: number;
  muted: boolean;

  onTogglePlayback?: EventHandler<PlayerTogglePlaybackEvent>;
  onPrevious?: EventHandler<PlayerPreviousEvent>;
  onNext?: EventHandler<PlayerNextEvent>;
  onSeek?: EventHandler<PlayerSeekEvent>;
  onToggleMute?: EventHandler<PlayerToggleMuteEvent>;
  onVolumeChange?: EventHandler<PlayerVolumeChangeEvent>;
}

interface PlayerState {
  handleOffset: number;
}

const mapStateToProps = (state: AppState) => ({
  loading: state.player.loading,
  playing: state.player.playing,
  hasSource: state.player.source != null,

  artist: state.player.artist,
  album: state.player.album,
  title: state.player.title,
  duration: state.player.duration,

  progress: state.player.progress,
  volume: state.player.volume,
  muted: state.player.muted,
});

const mapDispatchToProps = (dispatch: GlobalDispatcher) => ({
  onTogglePlayback: (e: PlayerTogglePlaybackEvent) => {
    dispatch(playerPlayOrPauseThunk({shouldPlay: e.playing}));
  },
  onSeek: (e: PlayerSeekEvent) => {
    dispatch(playerSeekThunk({seekTo: e.progress}));
  },
  onVolumeChange: (e: PlayerVolumeChangeEvent) => {
    dispatch(playerChangeVolumeThunk({volume: e.volume}));
  },
  onToggleMute: (e: PlayerToggleMuteEvent) => {
    dispatch(playerToggleMuteThunk({mute: e.mute}));
  },
});

export const Player = connect(mapStateToProps, mapDispatchToProps)(
  class extends React.Component<PlayerProps, PlayerState> {
    constructor (props: PlayerProps) {
      super(props);

      this.state = {
        handleOffset: 0,
      };
    }

    private handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      let parsed = /^[0-9]+$/.test(value) ? minMax(0, 100, Number.parseInt(value)) : 0;
      callOptionalHandler(this.props.onVolumeChange, {volume: parsed});
    };

    private handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      this.setState({handleOffset: event.pageX});
    };

    private handlePreviousButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      callOptionalHandler(this.props.onPrevious, {});
    };

    private handlePlayButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      callOptionalHandler(this.props.onTogglePlayback, {playing: true});
    };

    private handlePauseButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      callOptionalHandler(this.props.onTogglePlayback, {playing: false});
    };

    private handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      callOptionalHandler(this.props.onNext, {});
    };

    private handleMuteButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      callOptionalHandler(this.props.onToggleMute, {mute: true});
    };

    private handleUnmuteButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      callOptionalHandler(this.props.onToggleMute, {mute: false});
    };

    private handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
      callOptionalHandler(this.props.onSeek, {
        // Get the position of the mouse relative to the width of the viewport.
        progress: event.pageX / document.documentElement.clientWidth * this.props.duration,
      });
    };

    render () {
      return (
        <div id="player"
             data-has-source={this.props.hasSource}
             data-loading={this.props.loading}
             onMouseMove={this.handleMouseMove}
        >
          <div id="top">
            <div id="controls-left">
              <button id="button-previous" onClick={this.handlePreviousButtonClick}/>
              {this.props.playing ?
                <button id="button-pause" onClick={this.handlePauseButtonClick}/> :
                <button id="button-play" onClick={this.handlePlayButtonClick}/>
              }
              <button id="button-next" onClick={this.handleNextButtonClick}/>
            </div>

            <div id="details">
              <h1 id="title">{this.props.title}</h1>
              <h2 id="subtitle">{this.props.artist} &mdash; {this.props.album}</h2>
            </div>

            <div id="controls-right">
              {this.props.muted ?
                <button id="button-unmute" onClick={this.handleUnmuteButtonClick}/> :
                <button id="button-mute" onClick={this.handleMuteButtonClick}/>
              }
              <input id="volume-input"
                     type="number"
                     min={0}
                     max={100}
                     value={this.props.volume}
                     onChange={this.handleVolumeChange}/>
            </div>
          </div>

          <div id="progress-container"
               onClick={this.handleProgressClick}>
            <div id="progress" style={{width: `${this.props.progress}%`}}>
              <div id="handle" style={{left: `${this.state.handleOffset}px`}}/>
            </div>
          </div>
        </div>
      );
    }
  });

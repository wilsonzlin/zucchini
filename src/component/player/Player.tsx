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
import {PlaylistToggle} from "../playlist/PlaylistToggle";

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
  onTogglePlayback: (e: PlayerTogglePlaybackEvent) => dispatch(playerPlayOrPauseThunk({shouldPlay: e.playing})),
  onSeek: (e: PlayerSeekEvent) => dispatch(playerSeekThunk({seekTo: e.progress})),
  onVolumeChange: (e: PlayerVolumeChangeEvent) => dispatch(playerChangeVolumeThunk({volume: e.volume})),
  onToggleMute: (e: PlayerToggleMuteEvent) => dispatch(playerToggleMuteThunk({mute: e.mute})),
});

type MouseOrTouchEvent<T> = React.MouseEvent<T> | React.TouchEvent<T>;

const isTouchEvent = function <T> (event: React.SyntheticEvent<T>): event is React.TouchEvent<T> {
  return (event as any).touches instanceof TouchList;
};

const getMouseOrTouchX = (event: MouseOrTouchEvent<HTMLDivElement>) => {
  if (isTouchEvent(event)) {
    return event.touches[0].pageX;
  } else {
    return event.pageX;
  }
};

const getViewportWidth = () => {
  return document.documentElement.clientWidth;
};

const SEEK_DEBOUNCE_MS = 50;

export const Player = connect(mapStateToProps, mapDispatchToProps)(
  class extends React.Component<PlayerProps, PlayerState> {
    private seeking: boolean = false;
    private seekDebounce: number | undefined = undefined;

    constructor (props: PlayerProps) {
      super(props);

      this.state = {
        handleOffset: 0,
      };
    }

    render () {
      return (
        <div id="player"
             data-loading={this.props.loading}
        >
          <div id="controls-playback">
            <button id="button-previous" onClick={this.handlePreviousButtonClick}/>
            {this.props.playing ?
              <button id="button-pause" onClick={this.handlePauseButtonClick}/> :
              <button id="button-play" onClick={this.handlePlayButtonClick}/>
            }
            <button id="button-next" onClick={this.handleNextButtonClick}/>
          </div>

          <div id="current-song">
            <h1 id="title">{this.props.title}</h1>
            <h2 id="subtitle">{this.props.artist} &mdash; {this.props.album}</h2>
          </div>
          <PlaylistToggle/>

          <div id="controls-volume">
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

          <div id="progress-container"
            // Prevent long taps on touchscreens (e.g. pausing/holding while seeking) from opening context menu/popup.
               onContextMenu={e => e.preventDefault()}
               onMouseDown={this.handleProgressSeekingInputDown}
               onTouchStart={this.handleProgressSeekingInputDown}
               onMouseMove={this.handleProgressSeekingInputMove}
               onTouchMove={this.handleProgressSeekingInputMove}
               onMouseUp={this.handleProgressSeekingInputStop}
               onMouseLeave={this.handleProgressSeekingInputStop}
               onTouchEnd={this.handleProgressSeekingInputStop}
               onTouchCancel={this.handleProgressSeekingInputStop}
          >
            <div id="progress" style={{width: `${this.props.progress}%`}}>
              <div id="handle" style={{left: `${this.state.handleOffset}px`}}/>
            </div>
          </div>
        </div>
      );
    }

    private handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      let parsed = /^[0-9]+$/.test(value) ? minMax(0, 100, Number.parseInt(value)) : 0;
      callOptionalHandler(this.props.onVolumeChange, {volume: parsed});
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

    private seekToSeekingInput = (event: MouseOrTouchEvent<HTMLDivElement>) => {
      clearTimeout(this.seekDebounce);
      // Calculate now and store.
      const seekTo = getMouseOrTouchX(event) / getViewportWidth() * this.props.duration;
      this.seekDebounce = setTimeout(() => {
        callOptionalHandler(this.props.onSeek, {
          // Get the position of the mouse relative to the width of the viewport.
          progress: seekTo,
        });
      }, SEEK_DEBOUNCE_MS);
    };

    private handleProgressSeekingInputDown = (event: MouseOrTouchEvent<HTMLDivElement>) => {
      this.seeking = true;

      this.seekToSeekingInput(event);
    };

    private handleProgressSeekingInputMove = (event: MouseOrTouchEvent<HTMLDivElement>) => {
      this.setState({handleOffset: getMouseOrTouchX(event)});

      if (this.seeking) {
        this.seekToSeekingInput(event);
      }
    };

    private handleProgressSeekingInputStop = (event: MouseOrTouchEvent<HTMLDivElement>) => {
      this.seeking = false;
    };
  });

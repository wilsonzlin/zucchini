import {OptionalTitleName, OptionalTrackNumber} from "../../common/Media";
import {callOptionalHandler, EventHandler} from "../../common/Event";
import * as React from "react";
import {AppState} from "../../state/AppState";
import {connect} from "react-redux";
import {GlobalDispatcher} from "../../common/Action";
import {playerPlaySongThunk} from "../../state/PlayerState";

export interface PlayTrackEvent {
  file: string;
}

export interface TrackProps {
  file: string;
  track: OptionalTrackNumber;
  title: OptionalTitleName;

  onPlayTrack?: EventHandler<PlayTrackEvent>;
}

const connectStateToProps = (state: AppState) => ({});

const connectDispatchToProps = (dispatch: GlobalDispatcher) => ({
  onPlayTrack: (event: PlayTrackEvent) => {
    dispatch(playerPlaySongThunk({file: event.file}));
  },
});

export const Track = connect(connectStateToProps, connectDispatchToProps)((
  {
    file,
    track,
    title,

    onPlayTrack,
  }: TrackProps
) => (
  <div className="track tr" onClick={() => callOptionalHandler(onPlayTrack, {file})}>
    <div className="track-number td" style={{width: "35px"}}>{track}</div>
    <div className="track-title td">{title}</div>
  </div>
));

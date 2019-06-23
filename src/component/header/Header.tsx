import {EventHandler} from "../../common/Event";
import * as React from "react";
import "./Header.scss";
import {PlaylistEntryPlayEvent, PlaylistEntryRemoveEvent} from "../playlist/PlaylistEntry";
import {AppState} from "../../state/AppState";
import {connect} from "react-redux";
import {Search} from "../Search/Search";
import {GlobalDispatcher} from "../../common/Action";
import {Playlist} from "../playlist/Playlist";
import {PlaylistToggle} from "../playlist/PlaylistToggle";

export interface HeaderProps {
  onEntryPlay?: EventHandler<PlaylistEntryPlayEvent>;
  onEntryRemove?: EventHandler<PlaylistEntryRemoveEvent>;
}

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: GlobalDispatcher) => ({});

export const Header = connect(mapStateToProps, mapDispatchToProps)(
  class extends React.Component<HeaderProps> {
    constructor (props: HeaderProps) {
      super(props);
    }

    render () {
      return (
        <header>
          <div id="app-branding">
            <span id="app-logo">w.l</span>
            <h1 id="app-title">Music</h1>
          </div>
          <Search/>
          <PlaylistToggle/>
          <Playlist/>
        </header>
      );
    }
  });

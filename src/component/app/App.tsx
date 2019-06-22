import {Header} from "../header/Header";
import {Player} from "../player/Player";
import {Library} from "../library/Library";
import * as React from "react";
import {RepeatMode, ShuffleMode} from "../../common/Media";
import {AppState} from "../../state/AppState";
import {connect} from "react-redux";
import {GlobalDispatcher} from "../../common/Action";

export interface AppProps {
  searchTerm: string;
  repeatMode: RepeatMode;
  shuffleMode: ShuffleMode;
}

const mapStateToProps = (state: AppState) => ({
  searchTerm: state.library.searchTerm,
  repeatMode: state.player.repeatMode,
  shuffleMode: state.player.shuffleMode,
});

const mapDispatchToProps = (dispatch: GlobalDispatcher) => ({});

export const App = connect(mapStateToProps, mapDispatchToProps)(
  (props: AppProps) => (
    <div id="app">
      <Header
        playlist={[]}
        playlistVisible={true}
      />
      <main>
        <div id="mobile-branding">
          <span className="logo">w.l</span>
          <span className="title">Music</span>
        </div>
        <Player/>
        <Library/>
      </main>
    </div>
  )
);

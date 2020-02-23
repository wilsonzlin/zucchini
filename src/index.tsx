import {AppFactory} from 'component/App/factory';
import {LibrariesFactory} from 'component/Libraries/factory';
import {ListFactory} from 'component/List/factory';
import {OrganiserFactory} from 'component/Organiser/factory';
import {PlayerFactory} from 'component/Player/factory';
import {SearchFactory} from 'component/Search/factory';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.scss';
import {PlaylistFactory} from './component/Playlist/factory';
import {createCyclicFunctionDependenciesManager} from './common/Dependencies';
import {configure} from 'mobx';

configure({enforceActions: 'observed'});

const cyclicDependencies = createCyclicFunctionDependenciesManager<{
  playNext: () => void,
  playPrevious: () => void,
}>();

const {Player, playerState, playSong} = PlayerFactory({
  playPrevious: cyclicDependencies.values.playPrevious,
  playNext: cyclicDependencies.values.playNext,
});

const {Libraries, librariesState} = LibrariesFactory();

const {Search, searchState} = SearchFactory({getSongs: librariesState.getSongs});

const {Organiser, organiserState} = OrganiserFactory({
  getSongs: searchState.getFilteredSongs,
});

const {Playlist, playPrevious, playNext, updateAndPlayNowPlayingPlaylist} = PlaylistFactory({
  playSong,
  playbackHasEnded: playerState.hasEnded,
});
cyclicDependencies.provide('playPrevious', playPrevious);
cyclicDependencies.provide('playNext', playNext);

const {List} = ListFactory({
  updateAndPlayNowPlayingPlaylist: updateAndPlayNowPlayingPlaylist,
  getListing: organiserState.getListing,
});


const {App} = AppFactory({Libraries, Organiser, Player, Playlist, Search, List});

ReactDOM.render(
  <App/>,
  document.getElementById('root'),
);

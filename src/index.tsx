import {AppFactory} from "component/App/factory";
import {LibrariesFactory} from "component/Libraries/factory";
import {SongsFactory} from "component/List/factory";
import {OrganiserFactory} from "component/Organiser/factory";
import {PlayerFactory} from "component/Player/factory";
import {SearchFactory} from "component/Search/factory";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.scss";

const {Player, playSong} = PlayerFactory();

const {Libraries, librariesState} = LibrariesFactory();

const {Search, searchState} = SearchFactory({getSongs: librariesState.getSongs});

const {Organiser, organiserState} = OrganiserFactory({
  getSongs: searchState.getFilteredSongs,
});

const {Songs} = SongsFactory({
  playSong,
  getListing: organiserState.getListing,
});

// TODO
const Playlist = () => <h1>Playlist</h1>;

const {App} = AppFactory({Libraries, Organiser, Player, Playlist, Search, Songs});

ReactDOM.render(
  <App/>,
  document.getElementById("root")
);

/*
// TODO
const $searchInput = document.querySelector("#search") as HTMLInputElement;
window.addEventListener("keydown", e => {
  if (document.activeElement === $searchInput) {
    // Search input already has focus.
    return;
  }
  if (e.key == "f" && e.ctrlKey || e.key == "/") {
    e.preventDefault();
    $searchInput.focus();
  }
});
 */

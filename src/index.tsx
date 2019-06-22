import * as React from "react";
import * as ReactDOM from "react-dom";
import {App} from "./component/app/App";
import "./index.scss";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import {AppReducer} from "./state/AppState";
import {libraryAction} from "./state/LibraryState";
import {isWellFormedSong} from "./common/Media";
import thunk from "redux-thunk";

export const store = createStore(
  AppReducer,
  applyMiddleware(thunk)
);

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById("root")
);

const libraryDataURL = new URLSearchParams(location.search).get("library");
if (libraryDataURL == null) {
  // TODO
} else {
  fetch(libraryDataURL)
    .then(res => res.json())
    .then(songs => {
      if (!Array.isArray(songs)) {
        // TODO
        alert("Not an array");
        throw new Error();
      }

      for (const [id, song] of songs.entries()) {
        song.id = id;
        if (!isWellFormedSong(song)) {
          // TODO
          alert("Song is not valid");
          console.error(song);
          throw new Error();
        }
      }

      store.dispatch(libraryAction("UPDATE_SONGS", {
        songs: songs,
      }));
    });
}

// TODO
const $searchInput = document.querySelector("#search input") as HTMLInputElement;
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
$searchInput.addEventListener("keydown", e => {
  if (e.key == "Escape") {
    store.dispatch(libraryAction("UPDATE_SEARCH_TERM", {
      searchTerm: "",
    }));
  }
});

import * as React from "react";
import * as ReactDOM from "react-dom";
import {App} from "./component/app/App";
import "./index.scss";
import {Provider} from "react-redux";
import {applyMiddleware, createStore, Store} from "redux";
import {AppReducer} from "./state/AppState";
import {libraryAction} from "./state/LibraryState";
import {isWellFormedSong} from "./common/Media";
import thunk from "redux-thunk";
import {GlobalDispatcher} from "./common/Action";

// Fix store.dispatch not accepting redux-thunk functions.
export const store: Store | { dispatch: GlobalDispatcher; } = createStore(
  AppReducer,
  applyMiddleware(thunk)
);

ReactDOM.render(
  <Provider store={store as Store}>
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

      for (const song of songs) {
        if (!isWellFormedSong(song)) {
          // TODO
          alert("Song is not valid");
          console.error(song);
          throw new Error();
        }
      }

      store.dispatch(libraryAction("UPDATE_SONGS", {songs}));
    });
}

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

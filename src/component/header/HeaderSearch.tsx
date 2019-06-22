import * as React from "react";
import "./HeaderSearch.scss";
import {callOptionalHandler, EventHandler} from "../../common/Event";
import {AppState} from "../../state/AppState";
import {libraryAction} from "../../state/LibraryState";
import {connect} from "react-redux";
import {GlobalDispatcher} from "../../common/Action";

export interface HeaderSearchInputEvent {
  term: string;
}

export interface HeaderSearchProps {
  term: string;

  onSearch?: EventHandler<HeaderSearchInputEvent>;
}

const connectStateToProps = (state: AppState) => ({
  term: state.library.searchTerm,
});

const connectDispatchToProps = (dispatch: GlobalDispatcher) => ({
  onSearch: (event: HeaderSearchInputEvent) => {
    // Always dispatch, even if empty, to allow clearing search box.
    dispatch(libraryAction("UPDATE_SEARCH_TERM", {
      searchTerm: event.term,
    }));
  },
});

export const HeaderSearch = connect(connectStateToProps, connectDispatchToProps)(
  (props: HeaderSearchProps) => (
    <div id="search">
      <input placeholder="Artist, album, genre, decade&hellip;"
             value={props.term}
             onChange={(e: React.ChangeEvent<HTMLInputElement>) => callOptionalHandler(
               props.onSearch,
               // Don't trim, as this prevents typing spaces.
               {term: e.target.value}
             )}
      />
    </div>
  )
);

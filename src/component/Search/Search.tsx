import * as React from "react";
import "./Search.scss";
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
  // Always dispatch, even if empty, to allow clearing search box.
  onSearch: (event: HeaderSearchInputEvent) => dispatch(libraryAction("UPDATE_SEARCH_TERM", {
    searchTerm: event.term,
  })),
});

export const Search = connect(connectStateToProps, connectDispatchToProps)(
  (props: HeaderSearchProps) => (
    <input id="search"
           placeholder="Search artist, album, genre, decade&hellip;"
           value={props.term}
           onChange={(e: React.ChangeEvent<HTMLInputElement>) => callOptionalHandler(
             props.onSearch,
             // Don't trim, as this prevents typing spaces.
             {term: e.target.value}
           )}
    />
  )
);

import * as React from "react";
import "./Search.scss";
import {callOptionalHandler, EventHandler} from "../../common/Event";
import {AppState} from "../../state/AppState";
import {librarySearchThunk} from "../../state/LibraryState";
import {connect} from "react-redux";
import {GlobalDispatcher} from "../../common/Action";
import {textSearchAutocompleteToKey, TextSearchEngineAutocomplete} from "../../system/TextSearchEngineField";

export interface SearchInputEvent {
  term: string;
}

export interface SearchProps {
  term: string;
  error: string;
  loading: boolean;
  suggestions: TextSearchEngineAutocomplete[];

  onSearch?: EventHandler<SearchInputEvent>;
}

const connectStateToProps = (state: AppState) => ({
  term: state.library.searchTerm,
  error: state.library.searchError,
  loading: state.library.searchLoading,
  suggestions: state.library.searchSuggestions,
});

const connectDispatchToProps = (dispatch: GlobalDispatcher) => ({
  // Always dispatch, even if empty, to allow clearing search box.
  onSearch: (event: SearchInputEvent) => dispatch(librarySearchThunk({
    term: event.term,
  })),
});

export const Search = connect(connectStateToProps, connectDispatchToProps)(
  (props: SearchProps) => (
    <div id="search-centre">
      <input id="search"
             autoComplete={"off"}
             placeholder="Search artist, album, genre, decade&hellip;"
             value={props.term}
             onChange={(e: React.ChangeEvent<HTMLInputElement>) => callOptionalHandler(
               props.onSearch,
               // Don't trim, as this prevents typing spaces.
               {term: e.target.value}
             )}
      />
      <p>{props.loading && "Loading..."}</p>
      <p id="search-error">{props.error}</p>
      <ul id="search-suggestions">{
        props.suggestions.map(s => <li key={textSearchAutocompleteToKey(s)}>{s.field}: {s.value}</li>)
      }</ul>
    </div>
  )
);

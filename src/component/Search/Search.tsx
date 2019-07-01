import * as React from "react";
import "./Search.scss";
import {callOptionalHandler, EventHandler} from "../../common/Event";
import {AppState} from "../../state/AppState";
import {librarySearchThunk} from "../../state/LibraryState";
import {connect} from "react-redux";
import {GlobalDispatcher} from "../../common/Action";
import {TextSearchEngineAutocomplete} from "../../system/TextSearchEngineField";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar, faCalendarWeek, faCoffee, faFolder, faMicrophone} from "@fortawesome/free-solid-svg-icons";
import {faWallet} from "@fortawesome/free-solid-svg-icons/faWallet";

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

const renderSearchSuggestion = (suggestion: TextSearchEngineAutocomplete | undefined) => {
  if (!suggestion) {
    return <li className="search-suggestion"/>;
  }
  let icon = {
    "album": () => <FontAwesomeIcon icon={faFolder}/>,
    "artists": () => <FontAwesomeIcon icon={faMicrophone}/>,
    "genres": () => <FontAwesomeIcon icon={faCoffee}/>,
    "title": () => <FontAwesomeIcon icon={faWallet}/>,
    "year": () => <FontAwesomeIcon icon={faCalendar}/>,
    "decade": () => <FontAwesomeIcon icon={faCalendarWeek}/>,
  }[suggestion.field]();
  return <li className="search-suggestion">{icon} {suggestion.value}</li>;
};

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
        // TODO Comment
        renderSearchSuggestion(props.suggestions[0])
      }{
        renderSearchSuggestion(props.suggestions[1])
      }{
        renderSearchSuggestion(props.suggestions[2])
      }{
        renderSearchSuggestion(props.suggestions[3])
      }{
        renderSearchSuggestion(props.suggestions[4])
      }</ul>
    </div>
  )
);

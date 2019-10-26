import {renderPromise, WatchedPromise} from "common/Async";
import {cls} from "common/Classes";
import {callHandler, EventHandler} from "common/Event";
import {SearchType} from "component/Search/state";
import * as style from "component/Search/style.scss";
import {Song} from "model/Song";
import * as React from "react";
import {Dropdown, DropdownOption} from "ui/Dropdown/view";
import {Input} from "ui/Input/view";

export interface SearchProps {
  type: SearchType;
  term: string;
  status: WatchedPromise<Song[]>;
  suggestions: WatchedPromise<string[]>;

  onSearch?: EventHandler<string>;
}

const renderSearchAuxiliary = (props: SearchProps) => {
  switch (props.type) {
  case SearchType.FILTER:
  case SearchType.QUERY:
    return (
      <p className={cls(style.auxiliary, style.error)}>
        {props.status && props.status.value}
      </p>
    );
  case SearchType.TEXT:
    return renderPromise(props.suggestions, {
      fulfilled: suggestions => (
        <div className={style.auxiliary}>
          {suggestions.map(s => (
            <button className={style.suggestion}>{s}</button>
          ))}
        </div>
      )
    });
  }
};

const SearchInputTypeOptions: DropdownOption<SearchType>[] = [
  {value: SearchType.TEXT, label: "Search"},
  {value: SearchType.FILTER, label: "Filter"},
  {value: SearchType.QUERY, label: "Query"},
];

export const Search = (props: SearchProps) => {
  return (
    <div className={style.search}>
      <Dropdown value={SearchType.TEXT} options={SearchInputTypeOptions}/>
      <Input
        className={style.searchInput}
        autocomplete="off"
        placeholder="Search artist, album, genre, decade&hellip;"
        value={props.term}
        onChange={e => callHandler(props.onSearch, e)}
      />
      {renderSearchAuxiliary(props)}
    </div>
  );
};

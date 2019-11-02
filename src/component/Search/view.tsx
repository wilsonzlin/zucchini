import {renderPromise, WatchedPromise} from "common/Async";
import {cls} from "common/Classes";
import {callHandler, EventHandler} from "common/Event";
import {SearchType} from "component/Search/state";
import * as style from "component/Search/style.scss";
import {Song} from "model/Song";
import * as React from "react";
import {useState} from "react";
import {Dropdown, DropdownOption} from "ui/Dropdown/view";
import {Input} from "ui/Input/view";
import {useDismissible} from "ui/util/dismissible";

const SearchInputTypeOptions: DropdownOption<SearchType>[] = [
  {value: SearchType.TEXT, label: "Search"},
  {value: SearchType.FILTER, label: "Filter"},
  {value: SearchType.QUERY, label: "Query"},
];

export const Search = ({
  type,
  term,
  status,
  suggestions,

  onSearch,
  onSelectSuggestion,
}: {
  type: SearchType;
  term: string;
  status: WatchedPromise<Song[]>;
  suggestions: WatchedPromise<string[]>;

  onSearch?: EventHandler<string>;
  onSelectSuggestion?: EventHandler<string>;
}) => {
  const [showingAuxiliary, setShowingAuxiliary, onRelevantAuxiliaryClick] = useDismissible();
  const [keyboardFocusedSuggestion, setKeyboardFocusedSuggestion] = useState(-1);

  const exitAuxiliary = () => {
    setKeyboardFocusedSuggestion(-1);
    setShowingAuxiliary(false);
  };

  return (
    <div className={style.search}>
      <Dropdown value={SearchType.TEXT} options={SearchInputTypeOptions}/>
      <Input
        className={style.searchInput}
        autocomplete="off"
        placeholder="Search artist, album, genre, decade&hellip;"
        value={term}
        onKeyDown={e => {
          if (suggestions.state === "fulfilled") {
            switch (e.key) {
            case "ArrowUp":
              e.preventDefault();
              setKeyboardFocusedSuggestion(
                (keyboardFocusedSuggestion <= 0
                  ? suggestions.value.length
                  : keyboardFocusedSuggestion) - 1);
              break;
            case "ArrowDown":
              e.preventDefault();
              setKeyboardFocusedSuggestion((keyboardFocusedSuggestion + 1) % suggestions.value.length);
              break;
            case "Escape":
              exitAuxiliary();
              break;
            case "Enter":
              const suggestion = suggestions.value[keyboardFocusedSuggestion];
              if (suggestion != undefined) {
                callHandler(onSelectSuggestion, suggestion);
                exitAuxiliary();
              }
              break;
            }
          }
        }}
        onChange={e => {
          callHandler(onSearch, e);
          setShowingAuxiliary(true);
          setKeyboardFocusedSuggestion(-1);
        }}
      />
      <div
        className={cls(style.auxiliary)}
        hidden={!showingAuxiliary}
        onClick={() => onRelevantAuxiliaryClick()}
      >
        {renderPromise(suggestions, {
          fulfilled: suggestions => (
            <div className={style.suggestions}>
              {suggestions.map((s, i) => (
                <button className={cls(
                  style.suggestion,
                  keyboardFocusedSuggestion == i && style.keyboardFocusedSuggestion
                )}
                >{s}</button>
              ))}
            </div>
          ),
        })}
      </div>
    </div>
  );
};


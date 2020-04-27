import {renderPromise, WatchedPromise} from 'common/Async';
import {cls} from 'common/DOM';
import {callHandler, EventHandler} from 'common/Event';
import style from 'component/Search/style.scss';
import React, {useState} from 'react';
import {Input} from 'ui/Input/view';
import {useDismissible} from 'ui/util/dismissible';
import {IconButton} from '../../ui/Button/view';
import {StemmedArrowRightIcon} from '../../ui/Icon/view';

export const Search = ({
  unconfirmedTerm,
  confirmedTerm,
  suggestions,

  onSearchInput,
  onSearch,
  onSelectSuggestion,
}: {
  unconfirmedTerm: string;
  confirmedTerm: string;
  suggestions: WatchedPromise<string[]>;

  onSearchInput?: EventHandler<string>;
  onSearch?: EventHandler;
  onSelectSuggestion?: EventHandler<string>;
}) => {
  const [showingAuxiliary, setShowingAuxiliary, onRelevantAuxiliaryClick, onRelevantAuxiliaryFocus] = useDismissible();
  const [focusedSuggestion, setFocusedSuggestion] = useState(-1);

  const exitAuxiliary = () => {
    setFocusedSuggestion(-1);
    setShowingAuxiliary(false);
  };

  const useSuggestion = (suggestion: string) => {
    callHandler(onSelectSuggestion, suggestion);
    exitAuxiliary();
  };

  const useInput = () => {
    callHandler(onSearch);
    exitAuxiliary();
  };

  return (
    <div className={style.search} onFocusCapture={onRelevantAuxiliaryFocus}>
      <Input
        className={style.searchInput}
        autocomplete="off"
        placeholder="Search artist, album, genre, decade&hellip;"
        value={unconfirmedTerm}
        onKeyDown={e => {
          if (suggestions.state === 'fulfilled') {
            switch (e.key) {
            case 'ArrowUp':
              e.preventDefault();
              setFocusedSuggestion((focusedSuggestion <= 0 ? suggestions.value.length : focusedSuggestion) - 1);
              break;

            case 'ArrowDown':
              e.preventDefault();
              setFocusedSuggestion((focusedSuggestion + 1) % suggestions.value.length);
              break;

            case 'Escape':
              exitAuxiliary();
              break;

            case 'Enter':
              const suggestion = suggestions.value[focusedSuggestion];
              if (suggestion != undefined) {
                // Search suggested value.
                useSuggestion(suggestion);
              } else {
                // Search input value.
                useInput();
              }
              break;
            }
          } else if (e.key == 'Enter' && !unconfirmedTerm) {
            // Clear search.
            useInput();
          }
        }}
        onChange={e => {
          setShowingAuxiliary(true);
          callHandler(onSearchInput, e);
          setFocusedSuggestion(-1);
        }}
      />
      {unconfirmedTerm != confirmedTerm && <IconButton onClick={useInput}>{StemmedArrowRightIcon}</IconButton>}
      <div
        className={cls(style.auxiliary)}
        hidden={!showingAuxiliary}
        onClick={onRelevantAuxiliaryClick}
      >
        {renderPromise(suggestions, {
          fulfilled: suggestions => (
            <div className={style.suggestions}>
              {suggestions.map((s, i) => (
                <button
                  key={s}
                  className={cls(style.suggestion, focusedSuggestion == i && style.keyboardFocusedSuggestion)}
                  onMouseEnter={() => setFocusedSuggestion(i)}
                  onClick={() => useSuggestion(s)}
                >{s}</button>
              ))}
            </div>
          ),
        })}
      </div>
    </div>
  );
};


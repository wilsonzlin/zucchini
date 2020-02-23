import {Dispatch, SetStateAction, useEffect, useState} from 'react';

type SetShowing = Dispatch<SetStateAction<boolean>>;
type OnRelevantClick = () => void;
type OnRelevantFocus = () => void;

const showingStateSetters = new Set<SetShowing>();
const ignoredShowingStateSetters = new Set<SetShowing>();

window.addEventListener('click', () => {
  for (const setShowing of showingStateSetters) {
    if (!ignoredShowingStateSetters.delete(setShowing)) {
      setShowing(false);
    }
  }
});

let focusCaptureTimeout: any;
window.addEventListener('focus', () => {
  clearTimeout(focusCaptureTimeout);
  focusCaptureTimeout = setTimeout(() => {
    for (const setShowing of showingStateSetters) {
      if (!ignoredShowingStateSetters.delete(setShowing)) {
        setShowing(false);
      }
    }
  });
}, true);

export const useDismissible = (): [
  boolean,
  SetShowing,
  OnRelevantClick,
  OnRelevantFocus,
] => {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    showingStateSetters.add(setShowing);
    return () => {
      showingStateSetters.delete(setShowing);
      ignoredShowingStateSetters.delete(setShowing);
    };
  }, []);

  const ignore = () => ignoredShowingStateSetters.add(setShowing);

  return [
    showing,
    setShowing,
    ignore,
    ignore,
  ];
};

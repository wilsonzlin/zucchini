import {Dispatch, SetStateAction, useEffect, useState} from "react";

type SetShowing = Dispatch<SetStateAction<boolean>>;
type OnRelevantClick = () => void;

const showingStateSetters = new Set<SetShowing>();
const ignoredShowingStateSetters = new Set<SetShowing>();

window.addEventListener("click", () => {
  for (const setShowing of showingStateSetters) {
    if (!ignoredShowingStateSetters.delete(setShowing)) {
      setShowing(false);
    }
  }
});

export const useDismissible = (): [
  boolean,
  SetShowing,
  OnRelevantClick,
] => {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    showingStateSetters.add(setShowing);
    return () => {
      showingStateSetters.delete(setShowing);
      ignoredShowingStateSetters.delete(setShowing);
    };
  }, []);

  return [showing, val => {
    setShowing(val);
    // Dismiss other overlays when toggling an overlay.
    ignoredShowingStateSetters.clear();
    for (const otherSetShowing of showingStateSetters) {
      if (setShowing !== otherSetShowing) {
        otherSetShowing(false);
      }
    }
  }, () => {
    ignoredShowingStateSetters.add(setShowing);
  }];
};

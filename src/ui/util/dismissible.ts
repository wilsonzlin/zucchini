import {Dispatch, SetStateAction, useEffect, useState} from "react";

const showingStateSetters = new Set<any>();
const ignoredShowingStateSetters = new Set<any>();

window.addEventListener("click", () => {
  for (const setShowing of showingStateSetters) {
    if (!ignoredShowingStateSetters.delete(setShowing)) {
      setShowing(false);
    }
  }
});

export const useDismissible = (): [
  boolean,
  Dispatch<SetStateAction<boolean>>,
  () => void,
] => {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    showingStateSetters.add(setShowing);
    return () => {
      showingStateSetters.delete(setShowing);
      ignoredShowingStateSetters.delete(setShowing);
    };
  }, []);

  return [showing, setShowing, () => {
    ignoredShowingStateSetters.add(setShowing);
  }];
};

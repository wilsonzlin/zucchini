import * as React from "react";
import {useEffect, useState} from "react";

export const useDismissibleControl = (): [boolean, React.Dispatch<React.SetStateAction<boolean>>, () => void] => {
  const [showing, setShowing] = useState(false);

  let didRelevantClick = false;

  const onRelevantClick = () => {
    didRelevantClick = true;
  };

  useEffect(() => {
    if (!showing) {
      return;
    }
    const globalClickListener = () => {
      if (!didRelevantClick) {
        setShowing(false);
      } else {
        didRelevantClick = false;
      }
    };
    window.addEventListener("click", globalClickListener);
    return () => {
      window.removeEventListener("click", globalClickListener);
    };
  }, [showing]);

  return [showing, setShowing, onRelevantClick];
};

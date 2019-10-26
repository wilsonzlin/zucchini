import {useEffect, useState} from "react";

export const useDismissibleControl = () => {
  const [showing, setShowing] = useState(false);

  let didRelevantClick = false;

  const onRelevantClick = () => {
    didRelevantClick = true;
  };

  useEffect(() => {
    if (!showing) {
      return;
    }
    const globalClickListener = (e: any) => {
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

  return {onRelevantClick, showing, setShowing};
};

import {callOptionalHandler, EventHandler} from "../../common/Event";
import * as React from "react";
import {BrowsingMode} from "../../common/Media";

export interface HeaderBrowsingModeClickEvent {
  mode: BrowsingMode;
}

export interface HeaderBrowsingModeButtonProps {
  mode: BrowsingMode;
  label: string;

  onClick?: EventHandler<HeaderBrowsingModeClickEvent>;
}

export const HeaderBrowsingModeButton = (
  {
    mode,
    label,

    onClick,
  }: HeaderBrowsingModeButtonProps
) => (
  <button className="app-listing"
          onClick={() => callOptionalHandler(onClick, {mode: mode})}>
    {label}
  </button>
);

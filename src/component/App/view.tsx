import * as React from "react";
import style from "./style.scss";

export interface AppProps {
  themes: { [name: string]: string };
  selectedTheme: string;
  densities: { [name: string]: string };
  selectedDensity: string;

  Libraries: () => JSX.Element;
  Organiser: () => JSX.Element;
  Player: () => JSX.Element;
  Search: () => JSX.Element;
  Songs: () => JSX.Element;
}

export const App = (
  {
    themes,
    selectedTheme,
    densities,
    selectedDensity,

    Libraries,
    Organiser,
    Player,
    Search,
    Songs,
  }: AppProps
) => (
  <div className={style.app}>
    <style>
      {themes[selectedTheme]}
      {densities[selectedDensity]}
    </style>
    <Libraries/>
    <Organiser/>
    <Player/>
    <Search/>
    <Songs/>
  </div>
);

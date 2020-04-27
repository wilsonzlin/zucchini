import React from 'react';
import style from './style.scss';

export interface AppProps {
  themes: { [name: string]: string };
  selectedTheme: string;
  densities: { [name: string]: string };
  selectedDensity: string;

  List: () => JSX.Element;
  PlayerControl: () => JSX.Element;
  Playlist: () => JSX.Element;
  Search: () => JSX.Element;
}

export const App = ({
  themes,
  selectedTheme,
  densities,
  selectedDensity,

  List,
  PlayerControl,
  Playlist,
  Search,
}: AppProps) => (
  <div className={style.app}>
    <style>
      {themes[selectedTheme]}
      {densities[selectedDensity]}
    </style>

    <div className={style.toolbar}>
      <div className={style.search}><Search/></div>
    </div>
    <div className={style.songs}><List/></div>
    <div className={style.playlist}><Playlist/></div>
    <div className={style.player}><PlayerControl/></div>
  </div>
);

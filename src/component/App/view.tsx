import React from 'react';
import style from './style.scss';

export interface AppProps {
  themes: { [name: string]: string };
  selectedTheme: string;
  densities: { [name: string]: string };
  selectedDensity: string;

  Libraries: () => JSX.Element;
  List: () => JSX.Element;
  Organiser: () => JSX.Element;
  Player: () => JSX.Element;
  Playlist: () => JSX.Element;
  Search: () => JSX.Element;
}

export const App = ({
  themes,
  selectedTheme,
  densities,
  selectedDensity,

  Libraries,
  List,
  Organiser,
  Player,
  Playlist,
  Search,
}: AppProps) => (
  <div className={style.app}>
    <style>
      {themes[selectedTheme]}
      {densities[selectedDensity]}
    </style>

    <div className={style.toolbar}>
      <div className={style.libraries}><Libraries/></div>
      <div className={style.organiser}><Organiser/></div>
      <div className={style.search}><Search/></div>
    </div>
    <div className={style.songs}><List/></div>
    <div className={style.playlist}><Playlist/></div>
    <div className={style.player}><Player/></div>
  </div>
);

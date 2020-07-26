import {cls} from 'extlib/js/dom/classname';
import React from 'react';
import {viewport, ViewportMode} from 'system/Viewport';
import style from './style.scss';

export const App = ({
  themes,
  selectedTheme,
  densities,
  selectedDensity,

  Browser,
  Viewer,
  PlayerControl,
  Playlist,
}: {
  themes: { [name: string]: string };
  selectedTheme: string;
  densities: { [name: string]: string };
  selectedDensity: string;

  Browser: () => JSX.Element;
  PlayerControl: () => JSX.Element;
  Playlist: () => JSX.Element;
  Viewer: () => JSX.Element;
}) => (
  <div className={cls(style.app, viewport.mode == ViewportMode.SMALL ? style.smallApp : style.largeApp)}>
    <style>
      {themes[selectedTheme]}
      {densities[selectedDensity]}
    </style>

    <div className={style.browserArea}>
      <Browser/>
    </div>
    <div className={style.playlistArea}>
      <Playlist/>
    </div>
    <div className={style.playerArea}>
      <PlayerControl/>
    </div>
    <Viewer/>
  </div>
);

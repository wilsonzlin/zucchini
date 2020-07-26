import {callHandler, EventHandler} from 'common/Event';
import {ViewerMode} from 'component/Viewer/state';
import {cls} from 'extlib/js/dom/classname';
import {File} from 'model/Listing';
import React from 'react';
import {IconButton} from 'ui/Button/view';
import {CloseIcon, MenuIcon, NextTrackIcon, PauseIcon, PlayIcon, PreviousTrackIcon, ScreenIcon} from 'ui/Icon/view';
import style from './style.scss';

export const Viewer = ({
  file,
  mode,
  PlayerControl,
  PlayerViewport,
  playing,
  Playlist,
  showPlaylist,
  showOverlay,

  onInteraction,
  onNext,
  onPrevious,
  onRequestClose,
  onToggleMode,
  onTogglePlayback,
  onTogglePlaylist,
}: {
  file: File | undefined;
  mode: ViewerMode;
  PlayerControl: () => JSX.Element;
  PlayerViewport: () => JSX.Element;
  playing: boolean;
  Playlist: () => JSX.Element;
  showOverlay: boolean;
  showPlaylist: boolean;

  onInteraction?: EventHandler;
  onNext?: EventHandler;
  onPrevious?: EventHandler;
  onRequestClose?: EventHandler;
  onToggleMode?: EventHandler;
  onTogglePlayback?: EventHandler;
  onTogglePlaylist?: EventHandler;
}) => !file ? null : (
  <div className={cls(
    style.viewer,
    mode == ViewerMode.MODAL && style.modalMode,
    mode == ViewerMode.MINI && style.miniMode,
  )}>
    <div className={style.content}>
      <PlayerViewport/>
      <div className={cls(style.overlay, !showOverlay && style.overlayHidden)} onMouseMove={() => callHandler(onInteraction)}>
        <div className={style.header}>
          <IconButton onClick={() => callHandler(onRequestClose)}>{CloseIcon}</IconButton>
          <h1 className={style.title}>{file.title}</h1>
          <IconButton onClick={() => callHandler(onToggleMode)}>{ScreenIcon}</IconButton>
          <IconButton onClick={() => callHandler(onTogglePlaylist)}>{MenuIcon}</IconButton>
        </div>
        <div className={style.middle}>
          <button className={style.navButton} onClick={() => callHandler(onPrevious)}>{PreviousTrackIcon}</button>
          <button className={style.playbackButton} onClick={() => callHandler(onTogglePlayback)}>{playing ? PauseIcon : PlayIcon}</button>
          <button className={style.navButton} onClick={() => callHandler(onNext)}>{NextTrackIcon}</button>
        </div>
        <div className={style.controls}>
          <PlayerControl/>
        </div>
      </div>
    </div>
    {showPlaylist && (
      <div className={style.playlist}>
        <Playlist/>
      </div>
    )}
  </div>
);

import {EventHandler} from 'common/Event';
import {observer} from 'mobx-react';
import React from 'react';
import {PlayerControl as PlayerControlImpl} from './Control/view';
import {MediaDataState} from './Media/MediaData';
import {PlayerPresenter} from './presenter';
import {PlayerStore} from './state';
import {PlayerViewport as PlayerViewportImpl} from './Viewport/view';

export const PlayerFactory = ({
  dependencies: {
    videoElementFactory,
    audioElementFactory,
    imageElementFactory,
  },
  eventHandlers: {
    onRequestPlayPrevious,
    onRequestPlayNext,
  },
}: {
  dependencies: {
    videoElementFactory: () => HTMLVideoElement,
    audioElementFactory: () => HTMLAudioElement,
    imageElementFactory: () => HTMLImageElement,
  },
  universe: {},
  eventHandlers: {
    onRequestPlayPrevious: EventHandler,
    onRequestPlayNext: EventHandler,
  },
}) => {
  const store = new PlayerStore(videoElementFactory, audioElementFactory, imageElementFactory);
  const presenter = new PlayerPresenter(store, onRequestPlayPrevious);

  // TODO Error
  const PlayerControl = observer(({
    showFile,
    showPlaybackControls,
  }: {
    showFile: boolean;
    showPlaybackControls: boolean;
  }) => (
    <PlayerControlImpl
      duration={store.duration}
      file={store.file}
      loading={store.dataState === MediaDataState.LOADING}
      onHoverChangeSongDetails={presenter.setShowFileDetailsCard}
      onNext={onRequestPlayNext}
      onPlaybackChange={presenter.setPlaying}
      onPrevious={presenter.restartOrGoToPreviousFile}
      onSeek={presenter.setCurrentTime}
      onVolumeChange={presenter.setVolume}
      playing={store.playing}
      progress={store.currentTime}
      showFile={showFile}
      showFileDetailsCard={store.showFileDetailsCard}
      showPlaybackControls={showPlaybackControls}
      volume={store.volume}
    />
  ));

  const PlayerViewport = observer(() => (
    <PlayerViewportImpl
      element={store.viewElement}
    />
  ));

  return {
    views: {
      PlayerControl,
      PlayerViewport,
    },
    actions: {
      playFile: presenter.playFile,
      togglePlayback: presenter.togglePlayback,
    },
    state: {
      currentFile: () => store.file,
      ended: () => store.ended,
      playing: () => store.playing,
    },
    disposers: [],
  };
};

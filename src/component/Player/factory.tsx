import {observer} from 'mobx-react';
import React from 'react';
import {EventHandler} from '../../common/Event';
import {PlayerControl as PlayerControlView} from './Control/view';
import {MediaDataState} from './Media/MediaData';
import {PlayerPresenter} from './presenter';
import {PlayerStore} from './state';

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
  const PlayerControl = observer(() =>
    <PlayerControlView
      loading={store.dataState === MediaDataState.LOADING}
      playing={store.playing}
      file={store.file}
      duration={store.duration}
      progress={store.currentTime}
      volume={store.volume}
      shouldShowSongCard={store.showFileDetailsCard}

      onPrevious={presenter.restartOrGoToPreviousFile}
      onNext={onRequestPlayNext}

      onVolumeChange={presenter.setVolume}
      onPlaybackChange={presenter.setPlaying}
      onSeek={presenter.setCurrentTime}
      onHoverChangeSongDetails={presenter.setShowFileDetailsCard}
    />,
  );

  return {
    views: {
      PlayerControl,
    },
    actions: {
      playFile: presenter.playFile,
    },
    state: {
      currentFile: () => store.file,
      ended: () => store.ended,
    },
    disposers: [],
  };
};

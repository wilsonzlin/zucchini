import {Player as PlayerImpl} from 'component/Player/view';
import {observer} from 'mobx-react';
import React from 'react';
import {PlayerPresenter} from './presenter';
import {setUpMediaSession} from './setUpMediaSession';
import {PlayerState, PlayerStore} from './state';

export const PlayerFactory = ({
  playNext,
  playPrevious,
}: {
  playNext: () => void;
  playPrevious: () => void;
}) => {
  const store = new PlayerStore(Audio);
  const presenter = new PlayerPresenter(store);

  setUpMediaSession(store, presenter);

  const Player = observer(() =>
    <PlayerImpl
      loading={store.loading}
      playing={store.playing}
      song={store.song}
      progress={store.progress}
      volume={store.volume}
      shouldShowSongCard={store.hoveringSongDetails}

      onNext={playNext}
      onPrevious={playPrevious}

      onVolumeChange={presenter.setVolume}
      onPlaybackChange={presenter.setPlaying}
      onSeek={presenter.setCurrentTime}
      onHoverChangeSongDetails={presenter.setHoveringSongDetails}
    />,
  );

  return {
    Player,
    playerState: new PlayerState(store),
    playSong: presenter.play,
  };
};

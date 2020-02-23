import {Player as PlayerImpl} from 'component/Player/view';
import {observer} from 'mobx-react';
import * as React from 'react';
import {PlayerPresenter} from './presenter';
import {PlayerState, PlayerStore} from './state';
import {setUpMediaSession} from './setUpMediaSession';

type PlayerDependencies = {
  playNext: () => void;
  playPrevious: () => void;
};

export const PlayerFactory = ({
  playNext,
  playPrevious,
}: PlayerDependencies) => {
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

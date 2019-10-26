import {Player as PlayerImpl} from "component/Player/view";
import {observer} from "mobx-react";
import * as React from "react";
import {PlayerPresenter} from "./presenter";
import {PlayerStore} from "./state";

export const PlayerFactory = () => {
  const store = new PlayerStore(Audio);
  const presenter = new PlayerPresenter(store);

  const Player = observer(() =>
    <PlayerImpl
      loading={store.loading}
      playing={store.playing}
      song={store.song}
      progress={store.progress}
      volume={store.volume}
      shouldShowSongCard={store.hoveringSongDetails}

      onVolumeChange={presenter.setVolume}
      onPlaybackChange={presenter.setPlaying}
      onSeek={presenter.setCurrentTime}
      onHoverChangeSongDetails={presenter.setHoveringSongDetails}
    />
  );

  return {
    Player,
    playSong: presenter.play,
  };
};

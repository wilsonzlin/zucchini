import {PlaylistView, PlaylistViewMode} from './view';
import {observer} from 'mobx-react';
import React from 'react';
import {PlaylistStore} from './state';
import {PlaylistPresenter, PlayNextMode} from './presenter';
import {NOW_PLAYING_PLAYLIST_NAME} from './config';
import {ISong} from '../../model/Song';
import {reaction} from 'mobx';
import {viewport, ViewportMode} from '../../system/Viewport';

export type PlaylistDependencies = {
  playbackHasEnded: () => boolean;
  playSong: (song: ISong | undefined) => void;
};

// TODO This entire component (inc. view, state, config) is awkward.
export const PlaylistFactory = ({
  playbackHasEnded,
  playSong,
}: PlaylistDependencies) => {
  const store = new PlaylistStore();
  const presenter = new PlaylistPresenter(store, playSong);

  reaction(playbackHasEnded, ended => ended && presenter.playNext(PlayNextMode.NEXT));

  const Playlist = observer(() => (
    <PlaylistView
      mode={viewport.mode != ViewportMode.LARGE && !store.expanded ? PlaylistViewMode.BAR : PlaylistViewMode.PANEL}
      expanded={viewport.mode != ViewportMode.LARGE && store.expanded}
      onRequestExpand={presenter.expand}
      onRequestCollapse={presenter.collapse}

      nowPlayingPlaylist={NOW_PLAYING_PLAYLIST_NAME}
      otherPlaylists={store.otherPlaylists.map(p => p.name)}
      currentPlaylistSongs={store.currentPlaylist?.songs ?? store.nowPlayingPlaylist}
      currentPlaylistName={store.currentPlaylist?.name}
      currentSong={store.currentSong}

      repeatMode={store.repeatMode}
      shuffleMode={store.shuffleMode}

      onToggleRepeat={presenter.updateRepeatMode}
      onToggleShuffle={presenter.updateShuffleMode}
      onPlay={presenter.playSpecific}
    />
  ));

  return {
    Playlist,
    playPrevious: () => presenter.playNext(PlayNextMode.PREVIOUS),
    playNext: () => presenter.playNext(PlayNextMode.IGNORE_REPEAT_ONCE),
    updateAndPlayNowPlayingPlaylist: presenter.updateAndPlayNowPlayingPlaylist,
  };
};

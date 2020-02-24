import {EventHandler} from 'common/Event';
import React from 'react';
import {ISong} from '../../model/Song';
import {PlaylistBarView} from './Bar/view';
import {PlaylistPanelView} from './Panel/view';
import {RepeatMode, ShuffleMode} from './state';

export const enum PlaylistViewMode {
  BAR,
  PANEL,
}

export const PlaylistView = ({
  mode,
  expanded,

  nowPlayingPlaylist,
  otherPlaylists,
  currentPlaylistName,
  currentPlaylistSongs,
  currentSong,

  repeatMode,
  shuffleMode,

  onToggleRepeat,
  onToggleShuffle,
  onClear,
  onPlay,
  onRequestExpand,
  onRequestCollapse,
}: {
  mode: PlaylistViewMode;
  expanded: boolean;
  onRequestExpand?: EventHandler;
  onRequestCollapse?: EventHandler;

  nowPlayingPlaylist: string;
  otherPlaylists: string[];
  currentPlaylistName?: string;
  currentPlaylistSongs: ISong[];
  currentSong?: ISong;

  repeatMode: RepeatMode;
  shuffleMode: ShuffleMode;

  onToggleRepeat?: EventHandler<RepeatMode>;
  onToggleShuffle?: EventHandler<ShuffleMode>;
  onClear?: EventHandler;
  onPlay?: EventHandler<ISong>;
}) => (
  <div>
    {mode == PlaylistViewMode.BAR
      ? <PlaylistBarView
        onClick={onRequestExpand}
        onToggleRepeat={onToggleRepeat}
        onToggleShuffle={onToggleShuffle}
        playlist={currentPlaylistName ?? nowPlayingPlaylist}
        repeatMode={repeatMode}
        shuffleMode={shuffleMode}
      />
      : <PlaylistPanelView
        currentPlaylistName={currentPlaylistName}
        currentPlaylistSongs={currentPlaylistSongs}
        currentSong={currentSong}
        expanded={expanded}
        nowPlayingPlaylist={nowPlayingPlaylist}
        onClear={onClear}
        onPlay={onPlay}
        onRequestCollapse={onRequestCollapse}
        onToggleRepeat={onToggleRepeat}
        onToggleShuffle={onToggleShuffle}
        otherPlaylists={otherPlaylists}
        repeatMode={repeatMode}
        shuffleMode={shuffleMode}
      />
    }
  </div>
);

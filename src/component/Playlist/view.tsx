import {EventHandler} from 'common/Event';
import React from 'react';
import {WatchedPromise} from '../../common/Async';
import {MediaFile} from '../../model/Media';
import {GroupDelimiter} from '../../model/Playlist';
import {PlaylistBarView} from './Bar/view';
import {PlaylistPanelView} from './Panel/view';
import {RepeatMode, ShuffleMode, UiPlaylistId} from './state';

export const enum PlaylistViewMode {
  BAR,
  PANEL,
}

export const PlaylistView = ({
  mode,
  expanded,

  playlists,
  currentPlaylist,
  currentPlaylistName,
  currentPlaylistEntries,
  currentFile,

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

  playlists: WatchedPromise<{ id: UiPlaylistId; name: string; modifiable: boolean; }[]>;
  currentPlaylist?: UiPlaylistId;
  currentPlaylistName?: string;
  currentPlaylistEntries: WatchedPromise<(GroupDelimiter | MediaFile)[]>;
  currentFile?: MediaFile;

  repeatMode: RepeatMode;
  shuffleMode: ShuffleMode;

  onToggleRepeat?: EventHandler<RepeatMode>;
  onToggleShuffle?: EventHandler<ShuffleMode>;
  onClear?: EventHandler;
  onPlay?: EventHandler<MediaFile>;
}) => (
  mode == PlaylistViewMode.BAR
    ? <PlaylistBarView
      onClick={onRequestExpand}
      onToggleRepeat={onToggleRepeat}
      onToggleShuffle={onToggleShuffle}
      playlist={currentPlaylistName}
      repeatMode={repeatMode}
      shuffleMode={shuffleMode}
    />
    : <PlaylistPanelView
      currentFile={currentFile}
      currentPlaylist={currentPlaylist}
      currentPlaylistEntries={currentPlaylistEntries}
      expanded={expanded}
      onClear={onClear}
      onPlay={onPlay}
      onRequestCollapse={onRequestCollapse}
      onToggleRepeat={onToggleRepeat}
      onToggleShuffle={onToggleShuffle}
      playlists={playlists}
      repeatMode={repeatMode}
      shuffleMode={shuffleMode}
    />
);

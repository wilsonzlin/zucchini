import {WatchedPromise} from 'common/Async';
import {EventHandler} from 'common/Event';
import {File, Listing} from 'model/Listing';
import React from 'react';
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
  id,
  name,
  loading,
  error,
  entries,
  currentFile,

  repeatMode,
  shuffleMode,

  onChangePlaylist,
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

  playlists: { id: UiPlaylistId; name: string; modifiable: boolean; }[];
  id?: UiPlaylistId;
  name?: string;
  loading: boolean;
  error: string;
  entries: Listing[];
  currentFile?: File;

  repeatMode: RepeatMode;
  shuffleMode: ShuffleMode;

  onChangePlaylist?: EventHandler<UiPlaylistId | undefined>;
  onToggleRepeat?: EventHandler<RepeatMode>;
  onToggleShuffle?: EventHandler<ShuffleMode>;
  onClear?: EventHandler;
  onPlay?: EventHandler<File>;
}) => (
  mode == PlaylistViewMode.BAR ? (
    <PlaylistBarView
      name={name}
      onClick={onRequestExpand}
      onToggleRepeat={onToggleRepeat}
      onToggleShuffle={onToggleShuffle}
      repeatMode={repeatMode}
      shuffleMode={shuffleMode}
    />
  ) : (
    <PlaylistPanelView
      currentFile={currentFile}
      entries={entries}
      error={error}
      expanded={expanded}
      id={id}
      loading={loading}
      name={name}
      onChangePlaylist={onChangePlaylist}
      onClear={onClear}
      onPlay={onPlay}
      onRequestCollapse={onRequestCollapse}
      onToggleRepeat={onToggleRepeat}
      onToggleShuffle={onToggleShuffle}
      playlists={playlists}
      repeatMode={repeatMode}
      shuffleMode={shuffleMode}
    />
  )
);

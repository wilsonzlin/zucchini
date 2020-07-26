import {callHandler, EventHandler} from 'common/Event';
import {cls} from 'extlib/js/dom/classname';
import {File, isNotDir, Listing} from 'model/Listing';
import React from 'react';
import {IconButton} from 'ui/Button/view';
import {Dropdown} from 'ui/Dropdown/view';
import {CloseIcon} from 'ui/Icon/view';
import {renderRepeatButton, renderShuffleButton} from '../common/controls';
import {PlaylistEntry} from '../Entry/view';
import {RepeatMode, ShuffleMode, UiPlaylistId} from '../state';
import style from './style.scss';

export const PlaylistPanelView = ({
  expanded,
  onRequestCollapse,

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
}: {
  expanded: boolean,
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
  <div className={cls(style.playlist, expanded && style.expanded)}>
    {/* TODO onClear */}
    <div className={style.menu}>
      <Dropdown
        className={style.playlists}
        options={playlists.map(p => ({
          label: p.name,
          value: p.id,
        }))}
        onChange={onChangePlaylist}
        value={id}
      />
      {expanded && <IconButton onClick={() => callHandler(onRequestCollapse)}>{CloseIcon}</IconButton>}
    </div>
    <div className={style.controls}>
      {renderRepeatButton(repeatMode, onToggleRepeat, true)}
      {renderShuffleButton(shuffleMode, onToggleShuffle, true)}
    </div>
    <div className={style.queue}>
      {entries.filter(isNotDir).map(f => f.type == 'del' ? (
        {/* TODO */}
      ) : (
        <PlaylistEntry
          key={f.id}
          current={f.id === currentFile?.id}
          file={f}
          onPlay={() => callHandler(onPlay, f)}
        />
      ))}
    </div>
  </div>
);

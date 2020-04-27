import React from 'react';
import {renderPromise, WatchedPromise} from '../../../common/Async';
import {cls} from '../../../common/DOM';
import {callHandler, EventHandler} from '../../../common/Event';
import {MediaFile} from '../../../model/Media';
import {GroupDelimiter} from '../../../model/Playlist';
import {IconButton} from '../../../ui/Button/view';
import {Dropdown} from '../../../ui/Dropdown/view';
import {CloseIcon} from '../../../ui/Icon/view';
import {renderRepeatButton, renderShuffleButton} from '../common/controls';
import {PlaylistEntry} from '../Entry/view';
import {RepeatMode, ShuffleMode, UiPlaylistId} from '../state';
import style from './style.scss';

export const PlaylistPanelView = ({
  expanded,
  onRequestCollapse,

  playlists,
  currentPlaylist,
  currentPlaylistEntries,
  currentFile,

  repeatMode,
  shuffleMode,

  onToggleRepeat,
  onToggleShuffle,
  onClear, onPlay,
}: {
  expanded: boolean,
  onRequestCollapse?: EventHandler;

  playlists: WatchedPromise<{ id: UiPlaylistId; name: string; modifiable: boolean; }[]>;
  currentPlaylist?: UiPlaylistId;
  currentPlaylistEntries: WatchedPromise<(GroupDelimiter | MediaFile)[]>;
  currentFile?: MediaFile;

  repeatMode: RepeatMode;
  shuffleMode: ShuffleMode;

  onToggleRepeat?: EventHandler<RepeatMode>;
  onToggleShuffle?: EventHandler<ShuffleMode>;
  onClear?: EventHandler;
  onPlay?: EventHandler<MediaFile>;
}) => (
  <div className={cls(style.playlist, expanded && style.expanded)}>
    {/* TODO onClear */}
    <div className={style.menu}>
      {renderPromise(playlists, {
        fulfilled: playlists => (
          <Dropdown
            className={style.playlists}
            options={playlists.map(p => ({
              label: p.name,
              value: p.id,
            }))}
            value={currentPlaylist}
          />
        ),
      })}
      {expanded && <IconButton onClick={() => callHandler(onRequestCollapse)}>{CloseIcon}</IconButton>}
    </div>
    <div className={style.controls}>
      {renderRepeatButton(repeatMode, onToggleRepeat, true)}
      {renderShuffleButton(shuffleMode, onToggleShuffle, true)}
    </div>
    <div className={style.queue}>
      {renderPromise(currentPlaylistEntries, {
        fulfilled: entries => (
          <>
            {entries.map(f => f instanceof GroupDelimiter ? (
              {/* TODO */}
            ) : (
              <PlaylistEntry
                key={f.id}
                current={f.id === currentFile?.id}
                file={f}
                onPlay={() => callHandler(onPlay, f)}
              />
            ))}
          </>
        ),
      })}
    </div>
  </div>
);

import {ISong} from '../../../model/Song';
import {RepeatMode, ShuffleMode} from '../state';
import {callHandler, EventHandler} from '../../../common/Event';
import style from './style.scss';
import {Dropdown} from '../../../ui/Dropdown/view';
import {renderRepeatButton, renderShuffleButton} from '../common/controls';
import {FlexSpacer} from '../../../ui/FlexSpacer/view';
import {IconButton} from '../../../ui/Button/view';
import {CloseIcon, TrashIcon} from '../../Icon/view';
import {PlaylistEntry} from '../Entry/view';
import * as React from 'react';
import {cls} from '../../../common/Classes';

export const PlaylistPanelView = ({
  expanded,
  onRequestCollapse,

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
}: {
  expanded: boolean,
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
  <div className={cls(style.playlist, expanded && style.expanded)}>
    <div className={style.menu}>
      <Dropdown
        className={style.playlists}
        options={[
          {label: <em>{nowPlayingPlaylist}</em>, value: undefined},
          ...otherPlaylists.map(p => ({
            label: p,
            value: p,
          })),
        ]}
        value={currentPlaylistName}
      />
      {expanded && <IconButton onClick={() => callHandler(onRequestCollapse)}>{CloseIcon}</IconButton>}
    </div>
    <div className={style.controls}>
      {renderRepeatButton(repeatMode, onToggleRepeat)}
      {renderShuffleButton(shuffleMode, onToggleShuffle)}
      <FlexSpacer/>
      <IconButton className={style.control} onClick={() => callHandler(onClear)}>{TrashIcon}</IconButton>
    </div>
    <div className={style.queue}>
      {currentPlaylistSongs.map(s => <PlaylistEntry
        key={s.file}
        current={s.file === currentSong?.file}
        song={s}
        onPlay={() => callHandler(onPlay, s)}
      />)}
    </div>
  </div>
);

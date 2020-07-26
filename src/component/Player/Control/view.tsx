import {callHandler, EventHandler} from 'common/Event';
import {cls} from 'extlib/js/dom/classname';
import {File} from 'model/Listing';
import React from 'react';
import {viewport, ViewportMode} from 'system/Viewport';
import {IconButton} from 'ui/Button/view';
import {HoverCard, HoverCardAnchor} from 'ui/HoverCard/view';
import {NextTrackIcon, PauseIcon, PlayIcon, PreviousTrackIcon, VolumeIcon} from 'ui/Icon/view';
import {Slider} from 'ui/Slider/view';
import style from './style.scss';

export const PlayerControl = ({
  loading,
  playing,
  file,
  duration,

  progress,
  volume,

  showFile,
  showFileDetailsCard,
  showPlaybackControls,

  onNext,
  onPlaybackChange,
  onPrevious,
  onSeek,
  onVolumeChange,
  onHoverChangeSongDetails,
}: {
  loading: boolean;
  playing: boolean;
  file?: File;
  duration: number;

  // A number between 0 and $duration.
  progress: number;
  // A number between 0 and 1.
  volume: number;

  showFile: boolean;
  showFileDetailsCard: boolean;
  showPlaybackControls: boolean;

  onNext?: EventHandler;
  onPlaybackChange?: EventHandler<boolean>;
  onPrevious?: EventHandler;
  onSeek?: EventHandler<number>;
  onVolumeChange?: EventHandler<number>;
  onHoverChangeSongDetails?: EventHandler<boolean>;
}) => (
  <div className={cls({
    [style.player]: true,
    [style.loading]: loading,
    [style.smallPlayer]: viewport.mode == ViewportMode.SMALL,
    [style.largePlayer]: viewport.mode == ViewportMode.LARGE,
  })}>
    {showPlaybackControls && (
      <div className={style.playbackControls}>
        <IconButton
          className={style.previousButton}
          onClick={() => callHandler(onPrevious)}
        >{PreviousTrackIcon}</IconButton>
        {playing ?
          <IconButton
            onClick={() => callHandler(onPlaybackChange, false)}
          >{PauseIcon}</IconButton> :
          <IconButton
            onClick={() => callHandler(onPlaybackChange, true)}
          >{PlayIcon}</IconButton>
        }
        <IconButton
          className={style.nextButton}
          onClick={() => callHandler(onNext)}
        >{NextTrackIcon}</IconButton>
      </div>
    )}

    {showFile && (
      <div
        className={style.details}
        onMouseEnter={() => callHandler(onHoverChangeSongDetails, true)}
        onMouseLeave={() => callHandler(onHoverChangeSongDetails, false)}
      >
        {file ? (
          <>
            <div className={style.detailsLabel}>
              <strong className={style.title}>{file.title}</strong>
              {' '}
              {/* Only show em dash if both fields exist. */}
              {/* TODO */}
              {/*{song.artists.length && song.album != null ?*/}
              {/*  `${song.artists[0]}—${song.album}` :*/}
              {/*  `${song.artists[0]}${song.album}`*/}
              {/*}*/}
            </div>
            <HoverCard
              anchor={HoverCardAnchor.TOP}
              className={style.card}
              visible={showFileDetailsCard}
            >
              {/* TODO */}
              {/*<CardContents song={song}/>*/}
            </HoverCard>
          </>
        ) : (
          <div className={style.detailsLabel}>No media</div>
        )}
      </div>
    )}

    <Slider
      className={style.progress}
      min={0}
      max={duration}
      value={loading ? undefined : progress}
      onChange={e => callHandler(onSeek, e)}
    />

    <div className={style.volumeContainer}>
      <span className={style.volumeIcon}>{VolumeIcon}</span>
      <Slider
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={v => callHandler(onVolumeChange, v)}
      />
    </div>
  </div>
);

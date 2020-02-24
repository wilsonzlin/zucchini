import {cls} from 'common/Classes';
import {callHandler, EventHandler} from 'common/Event';
import {ISong} from 'model/Song';
import React from 'react';
import {IconButton} from 'ui/Button/view';
import {HoverCard, HoverCardAnchor} from 'ui/HoverCard/view';
import {Slider} from 'ui/Slider/view';
import {AlbumIcon, ArtistIcon, ArtistsIcon, NextTrackIcon, PauseIcon, PlayIcon, PreviousTrackIcon, VolumeIcon} from '../Icon/view';
import style from './style.scss';

const formatDuration = (d: number): string => {
  return `${Math.floor(d / 60)}:${Math.floor(d % 60)}`;
};

const CardContents = ({song}: { song: ISong }) => (
  <>
    {song.title != null && <h1 className={style.cardTitle}>{song.title}</h1>}
    {song.artists.length && <p className={style.cardArtists}>
      {song.artists.length == 1 ? ArtistIcon : ArtistsIcon}
      {' '}
      {song.artists.join('; ')}
    </p>}
    {song.album != null && <p className={style.cardAlbum}>{AlbumIcon} {song.album}</p>}
    <div className={style.cardOthers}>
      <p className={style.cardDuration}>{formatDuration(song.duration)}</p>
      {song.year != null && <p className={style.cardYear}> • {song.year}</p>}
      {song.genres.length && <p className={style.cardGenres}> • {song.genres.join('; ')}</p>}
    </div>
  </>
);

export const Player = ({
  loading,
  playing,
  song,

  progress,
  volume,

  shouldShowSongCard,

  onNext,
  onPlaybackChange,
  onPrevious,
  onSeek,
  onVolumeChange,
  onHoverChangeSongDetails,
}: {
  loading: boolean;
  playing: boolean;
  song?: ISong;

  // A number between 0 and $duration.
  progress: number;
  // A number between 0 and 1.
  volume: number;

  shouldShowSongCard: boolean;

  onNext?: EventHandler;
  onPlaybackChange?: EventHandler<boolean>,
  onPrevious?: EventHandler;
  onSeek?: EventHandler<number>;
  onVolumeChange?: EventHandler<number>;
  onHoverChangeSongDetails?: EventHandler<boolean>;
}) => (
  <div className={cls({
    [style.player]: true,
    [style.loading]: loading,
  })}>
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

    <div
      className={style.details}
      onMouseEnter={() => callHandler(onHoverChangeSongDetails, true)}
      onMouseLeave={() => callHandler(onHoverChangeSongDetails, false)}
    >
      {song ? (
        <>
          <div className={style.detailsLabel}>
            <strong className={style.title}>{song.title}</strong>
            {' '}
            {/* Only show em dash if both fields exist. */}
            {song.artists.length && song.album != null ?
              `${song.artists[0]}—${song.album}` :
              `${song.artists[0]}${song.album}`
            }
          </div>
          <HoverCard
            shouldShow={shouldShowSongCard}
            anchor={HoverCardAnchor.TOP}
            className={style.card}
          >
            <CardContents song={song}/>
          </HoverCard>
        </>
      ) : (
        <div className={style.detailsLabel}>No song</div>
      )}
    </div>

    <Slider
      className={style.progress}
      min={0}
      max={song ? song.duration : 0}
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

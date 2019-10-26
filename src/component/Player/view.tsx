import {cls} from "common/Classes";
import {callHandler, EventHandler} from "common/Event";
import {Song} from "model/Song";
import * as React from "react";
import {Button} from "ui/Button/view";
import {HoverCard, HoverCardAnchor} from "ui/HoverCard/view";
import {Slider} from "ui/Slider/view";
import style from "./style.scss";

export interface PlayerProps {
  loading: boolean;
  playing: boolean;
  song?: Song;

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
}

const formatDuration = (d: number): string => {
  return `${Math.floor(d / 60)}:${Math.floor(d % 60)}`;
};

const CardContents = ({song}: { song: Song }) => (
  <>
    {song.title != null && <h1 className={style.cardTitle}>{song.title}</h1>}
    {song.artists.length && <p className={style.cardArtists}>{song.artists.join("; ")}</p>}
    {song.album != null && <p className={style.cardAlbum}>{song.album}</p>}
    <div className={style.cardOthers}>
      <p className={style.cardDuration}>{formatDuration(song.duration)}</p>
      {song.year != null && <p className={style.cardYear}> • {song.year}</p>}
      {song.genres.length && <p className={style.cardGenres}> • {song.genres.join("; ")}</p>}
    </div>
  </>
);

export const Player = (
  {
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
  }: PlayerProps
) => (
  <div className={cls({
    [style.player]: true,
    [style.loading]: loading,
  })}>
    <div className={style.playbackControls}>
      <Button onClick={() => callHandler(onPrevious)}>⏮</Button>
      {playing ?
        <Button onClick={() => callHandler(onPlaybackChange, false)}>⏸</Button> :
        <Button onClick={() => callHandler(onPlaybackChange, true)}>▶</Button>
      }
      <Button onClick={() => callHandler(onNext)}>⏭</Button>
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
            {" "}
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

    <Slider
      min={0}
      max={1}
      step={0.01}
      value={volume}
      onChange={v => callHandler(onVolumeChange, v)}
    />
  </div>
);

import React from 'react';

// TODO Abstract
const formatDuration = (d: number): string => {
  return `${Math.floor(d / 60)}:${Math.floor(d % 60)}`;
};

/* TODO
export const CardContents = ({song}: { song: ISong }) => (
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
*/

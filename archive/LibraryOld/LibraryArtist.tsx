import {keyFromOptionalField, OptionalArtistName} from "../../common/Media";
import {Album, AlbumProps} from "./LibraryAlbum";
import * as React from "react";

export interface ArtistProps {
  artist: OptionalArtistName;
  albums: AlbumProps[];
}

export const Artist = (
  {
    artist,
    albums,
  }: ArtistProps
) => (
  <div className="artist">
    <h1 className="artist-name">{artist}</h1>
    <div>{
      albums.map(album => <Album
        key={keyFromOptionalField("album", album.album)}
        {...album}
      />)
    }</div>
  </div>
);

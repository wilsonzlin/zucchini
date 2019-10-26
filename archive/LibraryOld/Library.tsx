import * as React from "react";
import {Artist, ArtistProps} from "./LibraryArtist";
import {AppState} from "../../state/AppState";
import {connect} from "react-redux";
import {keyFromOptionalField, Song} from "../../common/Media";
import "./Library.scss";
import {GlobalDispatcher} from "../../common/Action";

export interface LibraryProps {
  filteredSongIds: string[] | null;

  songs: Song[];
  artists: ArtistProps[];
}

const mapStateToProps = (state: AppState) => ({
  filteredSongIds: state.library.filteredSongIds,

  songs: state.library.songs,
  artists: state.library.byArtist,
});

const mapDispatchToProps = (dispatch: GlobalDispatcher) => ({});

export const Library = connect(mapStateToProps, mapDispatchToProps)(
  (props: LibraryProps) => (
    <main id="library">
      <div id="library-artists">{
        // Map artists to artists with only albums with one or more songs after filtering.
        props.artists
          .map(artist => ({
            ...artist,
            // Map albums to albums with only filtered songs.
            albums: artist.albums
              .map(album => ({
                ...album,
                // Filter tracks in album.
                tracks: album.tracks.filter(track =>
                  props.filteredSongIds == null || props.filteredSongIds.includes(track.file)
                ),
              }))
              // Filter out albums with no tracks
              .filter(album => album.tracks.length),
          }))
          // Filter out artists with no tracks.
          .filter(artist => artist.albums.length)
          // Render artist.
          .map(artist => <Artist
            key={keyFromOptionalField("name", artist.artist)}
            {...artist}
          />)
      }</div>
    </main>
  )
);
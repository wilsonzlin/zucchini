import {ArtistNames, GenreNames, OptionalAlbumName, OptionalYearNumber, Song} from "../../common/Media";
import {Track} from "./LibraryTrack";
import * as React from "react";
import {AppState} from "../../state/AppState";
import {connect} from "react-redux";
import "./LibraryAlbum.scss";
import {GlobalDispatcher} from "../../common/Action";

export interface AlbumProps {
  album: OptionalAlbumName;
  genres: GenreNames;
  year: OptionalYearNumber;
  featuring: ArtistNames;
  tracks: Song[];
}

const connectStateToProps = (state: AppState) => ({
  filteredSongIds: state.library.filteredSongIds,
});

const connectDispatchToProps = (dispatch: GlobalDispatcher) => ({
  // TODO
});

export const Album = connect(connectStateToProps, connectDispatchToProps)(
  ({
     album,
     genres,
     year,
     featuring,
     tracks,
   }: AlbumProps
  ) => (
    <div className="album">
      <div className="album-details">
        <div className="left">
          <h2 className="album-name">{album}</h2>
          <div className="album-subtitle"><span className="album-genres">{
            genres.map(genre => <span key={genre}
                                      className="album-genre">{genre}</span>)
          }</span>
            &#8226;
            <span className="album-year">{year}</span></div>
        </div>
        <div className="flex-spacer"/>
        <div className="right">
          <div className="album-features">{
            featuring.map(feat => <span key={feat}
                                        className="featuring-artist">{feat}</span>)
          }</div>
        </div>
      </div>
      <div className="album-table table fixed">
        <div className="tbody">{tracks
          .map(track => <Track
            key={track.file}
            {...track}
          />)
        }</div>
      </div>
    </div>
  )
);

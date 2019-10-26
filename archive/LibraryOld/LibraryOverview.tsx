import {plural} from "../../common/Util";
import * as React from "react";
import {FileURL, Song} from "../../common/Media";

export interface LibraryOverviewProps {
  filteredSongIds: FileURL[];
  songs: Song[];
}

export const LibraryOverview = (props: LibraryOverviewProps) => (
  <div id="library-overview">{props.filteredSongIds ?
    plural("{} search result{:s}", props.filteredSongIds.length) :
    plural("{} song{:s} in library", props.songs.length)
  }</div>
);

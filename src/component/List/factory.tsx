import {watchPromise} from "common/Async";
import {Library as LibraryImpl} from "component/List/view";
import {Listing} from "component/Organiser/state";
import * as mobxReact from "mobx-react";
import {IPromiseBasedObservable} from "mobx-utils";
import {Song} from "model/Song";
import * as React from "react";
import {Columns} from "./config";
import {LibraryStore} from "./state";

export interface SongsDependencies {
  getListing: () => IPromiseBasedObservable<Listing> | undefined;
  playSong: (song: Song) => void;
}

export const SongsFactory = (
  {
    getListing,
    playSong,
  }: SongsDependencies
) => {
  const store = new LibraryStore(getListing);

  const Songs = mobxReact.observer(() =>
    <LibraryImpl
      listing={watchPromise(store.listing)}
      columns={Columns}

      onPlayTrack={playSong}
    />
  );

  return {
    Songs,
  };
};

import {watchPromise} from 'common/Async';
import {List as ListImpl} from 'component/List/view';
import {Listing} from 'component/Organiser/state';
import * as mobxReact from 'mobx-react';
import {IPromiseBasedObservable} from 'mobx-utils';
import {ISong} from 'model/Song';
import * as React from 'react';
import {Columns} from './config';
import {ListStore} from './state';

export interface ListDependencies {
  getListing: () => IPromiseBasedObservable<Listing> | undefined;
  updateAndPlayNowPlayingPlaylist: (songs: ISong[]) => void;
}

export const ListFactory = (
  {
    getListing,
    updateAndPlayNowPlayingPlaylist,
  }: ListDependencies,
) => {
  const store = new ListStore(getListing);

  const List = mobxReact.observer(() =>
    <ListImpl
      listing={watchPromise(store.listing)}
      columns={Columns}

      onPlayTracks={updateAndPlayNowPlayingPlaylist}
    />,
  );

  return {
    List,
  };
};

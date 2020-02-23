import {workerClient} from 'common/Worker';
import {OrganiserPresenter} from 'component/Organiser/presenter';
import {OrganiserState, OrganiserStore} from 'component/Organiser/state';
import * as mobxReact from 'mobx-react';
import {IPromiseBasedObservable} from 'mobx-utils';
import {ISong} from 'model/Song';
import * as React from 'react';
import ListingWorker from 'worker-loader!./listing.worker.ts';
import * as config from './config';
import {Organiser as OrganiserImpl} from './view';

export interface OrganiserDependencies {
  getSongs: () => IPromiseBasedObservable<ISong[]> | undefined;
}

export const OrganiserFactory = (
  {
    getSongs,
  }: OrganiserDependencies,
) => {
  const listingWorker = new ListingWorker();
  const store = new OrganiserStore(workerClient(listingWorker), getSongs);
  const presenter = new OrganiserPresenter(store);

  const Organiser = mobxReact.observer(() =>
    <OrganiserImpl
      statistics={store.listing && store.listing.state == 'fulfilled' ? {
        count: store.listing.value.count,
        duration: store.listing.value.duration,
      } : undefined}

      filterBy={store.filterField}
      filterOn={store.filterMatch}
      groupBy={store.groupField}
      subgroupBy={store.groupSubgroup}

      filterByOptions={store.availableFilterFields}
      filterByOptionLabels={config.FilterByOptionLabels}
      groupByOptions={store.availableGroupFields}
      groupByOptionLabels={config.GroupByOptionLabels}
      subgroupByOptions={store.availableSubgroupFields}
      subgroupByOptionLabels={config.SubgroupByOptionLabels}

      onChangeFilterBy={presenter.changeFilterField}
      onChangeFilterOn={presenter.changeFilterMatch}
      onChangeGroupBy={presenter.changeGroupField}
      onChangeSubgroupBy={presenter.changeGroupSubgroup}
    />,
  );

  return {
    Organiser,
    organiserState: new OrganiserState(store),
  };
};

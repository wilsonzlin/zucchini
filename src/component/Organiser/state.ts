import {WorkerClient} from 'common/Worker';
import {ListingWorkerRequests} from 'component/Organiser/listing.worker';
import {computed, observable, toJS} from 'mobx';
import {fromPromise, IPromiseBasedObservable} from 'mobx-utils';
import {Field, FILTERABLE_FIELDS, GROUPABLE_FIELDS, ISong, SUBGROUPABLE_FIELDS} from 'model/Song';

export interface ISubgroup {
  field?: Field;
  name?: string;
  songs: ISong[];
}

export interface IGroup {
  field?: Field;
  name?: string;
  subgroups: ISubgroup[];
}

export type Listing = {
  groups: IGroup[];
  count: number;
  duration: number;
};

export class OrganiserStore {
  @observable filter?: { field: Field; match: string };
  // subgroup to be provided without a group.
  @observable group?: { field: Field; subgroup?: Field };
  // This type allows for a group to be provided with or without a
  // subgroup, or no group or subgroup to be provided, but not a

  constructor (
    private readonly listingWorker: WorkerClient<ListingWorkerRequests>,
    private readonly getSongs: () => IPromiseBasedObservable<ISong[]> | undefined,
  ) {
  }

  @computed get filterField () {
    return this.filter && this.filter.field;
  }

  @computed get filterMatch () {
    return this.filter ? this.filter.match : '';
  }

  @computed get groupField () {
    return this.group && this.group.field;
  }

  @computed get groupSubgroup () {
    return this.group && this.group.subgroup;
  }

  @computed get availableFilterFields () {
    return [undefined, ...FILTERABLE_FIELDS];
  }

  @computed get availableGroupFields () {
    return [
      undefined,
      ...GROUPABLE_FIELDS.filter(field => field !== this.filterField),
    ];
  }

  @computed get availableSubgroupFields () {
    return [
      undefined,
      ...SUBGROUPABLE_FIELDS.filter(field => field !== this.filterField && field !== this.groupField),
    ];
  }

  @computed get listing (): IPromiseBasedObservable<Listing> | undefined {
    const filter = this.filter;
    const group = this.group;
    const songs = this.getSongs();
    return songs && fromPromise(songs.then(
      songs => this.listingWorker.getListing(toJS({songs, filter, group}, {recurseEverything: true})),
    ));
  }
}

export class OrganiserState {
  constructor (
    private readonly store: OrganiserStore,
  ) {
  }

  getFilter = () => {
    return this.store.filter;
  };

  getGroup = () => {
    return this.store.group;
  };

  getListing = () => {
    return this.store.listing;
  };
}

import {WorkerClient} from "common/Worker";
import {ListingWorkerRequests} from "component/Organiser/listing.worker";
import {computed, observable, toJS} from "mobx";
import {fromPromise, IPromiseBasedObservable} from "mobx-utils";
import {Field, FILTERABLE_FIELDS, GROUPABLE_FIELDS, Song, SUBGROUPABLE_FIELDS} from "model/Song";

export interface GroupedSongs {
  name: string;
  field: Field;
  songs: Song[];
}

export interface SubgroupedSongs {
  name: string;
  field: Field;
  subgroups: GroupedSongs[];
}

export interface SingleListing {
  type: "single";
  units: Song[];
}

export interface GroupedListing {
  type: "grouped";
  units: GroupedSongs[];
}

export interface SubgroupedListing {
  type: "subgrouped";
  units: SubgroupedSongs[];
}

export type Listing = (SingleListing | GroupedListing | SubgroupedListing) & {
  count: number;
  duration: number;
};

export class OrganiserStore {
  constructor (
    private readonly listingWorker: WorkerClient<ListingWorkerRequests>,
    private readonly getSongs: () => IPromiseBasedObservable<Song[]> | undefined,
  ) {
  }

  @observable filter?: { field: Field; match: string };
  // This type allows for a group to be provided with or without a
  // subgroup, or no group or subgroup to be provided, but not a
  // subgroup to be provided without a group.
  @observable group?: { field: Field; subgroup?: Field };

  @computed get filterField () {
    return this.filter && this.filter.field;
  }

  @computed get filterMatch () {
    return this.filter ? this.filter.match : "";
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
      ...GROUPABLE_FIELDS.filter(field => field !== this.filterField)
    ];
  }

  @computed get availableSubgroupFields () {
    return [
      undefined,
      ...SUBGROUPABLE_FIELDS.filter(field => field !== this.filterField && field !== this.groupField)
    ];
  }

  @computed get listing (): IPromiseBasedObservable<Listing> | undefined {
    const filter = this.filter;
    const group = this.group;
    const songs = this.getSongs();
    return songs && fromPromise(songs.then(
      songs => this.listingWorker.getListing(toJS({songs, filter, group}, {recurseEverything: true}))
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

import {Listing} from "component/Organiser/state";
import {computed} from "mobx";
import {IPromiseBasedObservable} from "mobx-utils";

export class ListStore {
  constructor (
    private readonly getListing: () => IPromiseBasedObservable<Listing> | undefined,
  ) {
  }

  @computed
  get listing () {
    return this.getListing();
  }
}

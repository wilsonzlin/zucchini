import {OrganiserStore} from "component/Organiser/state";
import {action} from "mobx";
import {Field} from "model/Song";

export class OrganiserPresenter {
  constructor (
    private readonly store: OrganiserStore,
  ) {
  }

  @action
  changeFilterField = (field: Field | undefined) => {
    this.store.filter = field && {
      field,
      match: this.store.filterMatch || "",
    };
  };

  @action
  changeFilterMatch = (match: string) => {
    this.store.filter = this.store.filter && {
      field: this.store.filter.field,
      match,
    };
  };

  @action
  changeGroupField = (groupBy: Field | undefined) => {
    this.store.group = groupBy && {
      field: groupBy,
      // Always reset subgroup.
    };
  };

  @action
  changeGroupSubgroup = (subgroupBy: Field | undefined) => {
    this.store.group = this.store.group && {
      field: this.store.group.field,
      subgroup: subgroupBy && subgroupBy != this.store.group.field ? subgroupBy : undefined,
    };
  };
}

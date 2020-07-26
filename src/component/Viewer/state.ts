import {computed, observable} from 'mobx';
import {File} from 'model/Listing';

export const enum ViewerMode {
  MINI,
  MODAL,
}

export class ViewerStore {
  @observable.ref mode: ViewerMode = ViewerMode.MODAL;
  @observable.ref showPlaylist: boolean = false;
  @observable.ref engaged: boolean = true;

  constructor (
    private readonly currentFile: () => File | undefined,
  ) {
  }

  @computed
  get showOverlay () {
    return !this.currentFile() || !this.engaged;
  }
}

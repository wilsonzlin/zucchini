import {ViewerMode, ViewerStore} from 'component/Viewer/state';
import {UnreachableError} from 'extlib/js/assert/assert';
import {action} from 'mobx';

export class ViewerPresenter {
  private interactionTimeout: number | undefined = undefined;

  constructor (
    private readonly store: ViewerStore,
  ) {
  }

  @action
  toggleMode = () => {
    switch (this.store.mode) {
    case ViewerMode.MINI:
      this.store.mode = ViewerMode.MODAL;
      break;
    case ViewerMode.MODAL:
      this.store.mode = ViewerMode.MINI;
      break;
    default:
      throw new UnreachableError();
    }
  };

  @action
  handleInteraction = () => {
    this.store.engaged = false;
    clearTimeout(this.interactionTimeout);
    this.interactionTimeout = setTimeout(action(() => {
      this.store.engaged = true;
    }), 1000);
  };

  @action
  togglePlaylist = () => {
    this.store.showPlaylist = !this.store.showPlaylist;
  };
}

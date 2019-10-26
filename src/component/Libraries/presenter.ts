import {LibrariesStore, Library} from "component/Libraries/state";

export class LibrariesPresenter {
  constructor (
    private readonly store: LibrariesStore,
  ) {
  }

  setSelectedLibrary = (library: Library) => {
    this.store.selectedLibrary = library;
  };
}

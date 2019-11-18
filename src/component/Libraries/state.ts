import {JSON_CODEC, LibrariesLSKey} from "common/LocalStorage";
import {UserError} from "common/UserError";
import {DefaultLibraries} from "component/Libraries/config";
import {computed, observable} from "mobx";
import {fromPromise, IPromiseBasedObservable} from "mobx-utils";
import {isWellFormedSong, Song} from "model/Song";

export interface Library {
  name: string;
  URL: string;
}

const LIBRARIES = new LibrariesLSKey<Library[]>("LIBRARIES", JSON_CODEC);

const assertWellFormedSongs = (data: any): Song[] => {
  if (!Array.isArray(data) || !data.every(e => isWellFormedSong(e))) {
    throw new UserError("Library URL does not point to a list of songs that zucchini understands");
  }
  return data;
};

export class LibrariesStore {
  @observable libraries: Library[] = LIBRARIES.getOrDefault(DefaultLibraries);
  @observable selectedLibrary?: Library = this.libraries[0];

  @computed get songs (): IPromiseBasedObservable<Song[]> | undefined {
    return fromPromise(
      !this.selectedLibrary ?
        Promise.reject(new UserError("No library selected")) :
        fetch(this.selectedLibrary.URL)
          .then(res => res.json())
          .then(songs => assertWellFormedSongs(songs))
    );
  }
}

export class LibrariesState {
  constructor (
    private readonly store: LibrariesStore,
  ) {
  }

  getSongs = () => {
    return this.store.songs;
  };
}

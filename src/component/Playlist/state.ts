import {mapFulfilled} from 'common/Async';
import {mapIndexOf} from 'extlib/js/array';
import {computed, observable} from 'mobx';
import {IPromiseBasedObservable} from 'mobx-utils';
import {File, isFile, Listing} from 'model/Listing';

export const enum RepeatMode {
  OFF,
  ONE,
  ALL,
}

export const enum ShuffleMode {
  OFF,
  ALL,
}

export type UiPlaylistId = string | symbol;

export class PlaylistStore {
  @observable repeatMode: RepeatMode = RepeatMode.OFF;
  @observable shuffleMode: ShuffleMode = ShuffleMode.OFF;

  @observable customPlaylists: IPromiseBasedObservable<{ id: string; name: string; modifiable: boolean; }[]> | undefined = undefined;
  @observable id: UiPlaylistId | undefined = undefined;
  @observable loading: boolean = false;
  @observable error: string = '';
  @observable.ref entries: Listing[] = [];

  @observable expanded: boolean = false;

  constructor (
    private readonly currentFile: () => File | undefined,
    private readonly localPlaylists: () => { id: symbol, name: string; entries: Listing[] }[],
  ) {
  }

  @computed get playlists (): { id: UiPlaylistId; name: string; modifiable: boolean; }[] {
    return [
      ...this.localPlaylists().map(playlist => ({
        id: playlist.id,
        name: playlist.name,
        // TODO
        modifiable: false,
      })),
      ...mapFulfilled(this.customPlaylists, l => l) ?? [],
    ];
  }

  @computed get name (): string | undefined {
    return this.playlists.find(p => p.id === this.id)?.name;
  }

  private getNeighbouringFile (direction: number, wrap: boolean): File | undefined {
    const files = this.entries.filter(isFile);
    const len = files.length;
    return mapIndexOf(
      files.findIndex(e => e.id === this.currentFile()?.id),
      idx => wrap ? files[(idx + direction + len) % len] : files[idx + direction],
    );
  }

  @computed get previousFile (): File | undefined {
    return this.getNeighbouringFile(-1, false);
  }

  @computed get nextFile (): File | undefined {
    return this.getNeighbouringFile(1, false);
  }

  @computed get previousFileWrapped (): File | undefined {
    return this.getNeighbouringFile(-1, true);
  }

  @computed get nextFileWrapped (): File | undefined {
    return this.getNeighbouringFile(1, true);
  }
}

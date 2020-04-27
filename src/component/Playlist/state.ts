import {computed, observable} from 'mobx';
import {IPromiseBasedObservable} from 'mobx-utils';
import {mapFulfilled} from '../../common/Async';
import {MediaFile} from '../../model/Media';
import {GroupDelimiter, SpecialPlaylist} from '../../model/Playlist';

export const enum RepeatMode {
  OFF,
  ONE,
  ALL,
}

export const enum ShuffleMode {
  OFF,
  ALL,
}

export type UiPlaylistId = SpecialPlaylist | string | symbol;

export class PlaylistStore {
  @observable repeatMode: RepeatMode = RepeatMode.OFF;
  @observable shuffleMode: ShuffleMode = ShuffleMode.OFF;

  @observable playlists: IPromiseBasedObservable<{ id: UiPlaylistId; name: string; modifiable: boolean; }[]> | undefined = undefined;
  @observable currentPlaylist: UiPlaylistId | undefined = undefined;
  @observable currentPlaylistEntries: IPromiseBasedObservable<(GroupDelimiter | MediaFile)[]> | undefined;

  @observable expanded: boolean = false;

  constructor (
    private readonly currentFile: () => MediaFile | undefined,
  ) {
  }

  @computed get currentPlaylistName (): string | undefined {
    return mapFulfilled(this.playlists, playlists => playlists.find(p => p.id === this.currentPlaylist)?.name);
  }

  private getNeighbouringFile (direction: number): MediaFile | undefined {
    const entries = mapFulfilled(this.currentPlaylistEntries, playlist => playlist);
    if (!entries) {
      return undefined;
    }
    const idx = entries.findIndex(e => !(e instanceof GroupDelimiter) && e.id === this.currentFile()?.id);
    if (idx == -1) {
      return undefined;
    }
    for (let i = idx + direction; i >= 0 && i < entries.length; i += direction) {
      const entry = entries[i];
      if (!(entry instanceof GroupDelimiter)) {
        return entry;
      }
    }
    return undefined;
  }

  @computed get previousFile (): MediaFile | undefined {
    return this.getNeighbouringFile(-1);
  }

  @computed get nextFile (): MediaFile | undefined {
    return this.getNeighbouringFile(1);
  }
}

import {observable} from 'mobx';
import {FileType, Listing} from 'model/Listing';

export const enum BrowserViewMode {
  LIST,
  TILE,
}

export class BrowserStore {
  @observable.ref viewMode: BrowserViewMode = BrowserViewMode.TILE;

  @observable.ref currentPath: string[] = [];
  @observable.ref subdirectories: boolean = false;
  @observable.ref types: FileType[] = ['audio'];

  @observable.ref entries: Listing[] = [];
  @observable.ref loading: boolean = false;
  @observable.ref error: string | undefined = undefined;
  @observable.ref continuation: string | undefined = undefined;
  @observable.ref approximateSize: number | undefined = undefined;
  @observable.ref approximateDuration: number | undefined = undefined;
  @observable.ref approximateCount: number | undefined = undefined;
}

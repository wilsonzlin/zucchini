import {observable} from 'mobx';
import {MediaFile, MediaFileType} from '../../model/Media';
import {GroupDelimiter} from '../../model/Playlist';

export type ListViewColumnDefinition = {
  field: string;
  label: string;
  width: number;
  align?: 'left' | 'center' | 'right';
};

export class ListViewStore {
  @observable.ref currentPath: string[] = [];
  @observable.ref subdirectories: boolean = false;
  @observable.ref types: MediaFileType[] = [MediaFileType.AUDIO];

  @observable.ref entries: (GroupDelimiter | MediaFile)[] = [];
  @observable.ref loading: boolean = false;
  @observable.ref error: string | undefined = undefined;
  @observable.ref continuation: string | undefined = undefined;
  @observable.ref approximateSize: number | undefined = undefined;
  @observable.ref approximateDuration: number | undefined = undefined;
  @observable.ref approximateCount: number | undefined = undefined;
}

import {computed, observable} from 'mobx';
import {INTEGER_CODEC, PlayerLSKey} from '../../common/LocalStorage';
import {ISong} from '../../model/Song';

export const enum RepeatMode {
  OFF,
  ONE,
  ALL,
}

export const enum ShuffleMode {
  OFF,
  ALL,
}

export type IPlaylist = {
  name: string;
  songs: ISong[];
};

const REPEAT_MODE = new PlayerLSKey<RepeatMode>('PLAYER_REPEAT_MODE', INTEGER_CODEC);
const SHUFFLE_MODE = new PlayerLSKey<ShuffleMode>('PLAYER_SHUFFLE_MODE', INTEGER_CODEC);

export class PlaylistStore {
  @observable repeatMode: RepeatMode = REPEAT_MODE.getOrDefault(RepeatMode.OFF);
  @observable shuffleMode: ShuffleMode = SHUFFLE_MODE.getOrDefault(ShuffleMode.OFF);

  @observable nowPlayingPlaylist: ISong[] = [];
  @observable otherPlaylists: IPlaylist[] = [];

  @observable currentPlaylist?: IPlaylist;
  @observable currentSong?: ISong;

  @observable expanded: boolean = false;

  @computed get currentPlaylistSongs (): ISong[] {
    return this.currentPlaylist?.songs ?? this.nowPlayingPlaylist;
  }
}

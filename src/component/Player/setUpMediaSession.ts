import {PlayerStore} from './state';
import {reaction} from 'mobx';
import {PlayerPresenter} from './presenter';

declare class MediaMetadata {
  constructor(metadata: {
    title: string;
    artist: string;
    album: string;
    artwork: { src: string; sizes?: string; type?: string }[];
  });
}

type MediaSessionAction =
  'play' |
  'pause' |
  'seekbackward' |
  'seekforward' |
  'previoustrack' |
  'nexttrack' |
  'skipad' |
  'stop' |
  'seekto';

interface MediaSessionActionDetails {
  action: MediaSessionAction;
}

type MediaSessionActionHandler = (details: MediaSessionActionDetails) => void;

declare class MediaSession {
  metadata?: MediaMetadata;

  setActionHandler(type: MediaSessionAction, callback: MediaSessionActionHandler): void;
}

declare class Navigator {
  mediaSession: MediaSession;
}

declare var navigator: Navigator;

export const setUpMediaSession = (store: PlayerStore, presenter: PlayerPresenter) => {
  const {mediaSession} = navigator;
  if (!mediaSession) return;

  const handlePlay = () => presenter.setPlaying(true);
  const handlePause = () => presenter.setPlaying(false);

  const disposers = [
    reaction(
      () => store.song,
      song => {
        mediaSession.metadata = song && new MediaMetadata({
          title: song.title || '',
          artist: song.artists.join('; '),
          album: song.album || '',
          artwork: [],
        });
      },
    ),
  ];

  mediaSession.setActionHandler('play', handlePlay);
  mediaSession.setActionHandler('pause', handlePause);

  return {
    destroy: () => {
      for (const disposer of disposers) {
        disposer();
      }
      // TODO There's currently no API to remove action handlers.
    },
  };
};

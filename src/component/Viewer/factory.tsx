import {EventHandler} from 'common/Event';
import {ViewerPresenter} from 'component/Viewer/presenter';
import {ViewerStore} from 'component/Viewer/state';
import {observer} from 'mobx-react';
import {File} from 'model/Listing';
import React from 'react';
import {Viewer as ViewerImpl} from './view';

export const ViewerFactory = ({
  dependencies: {
    PlayerControl,
    PlayerViewport,
    playFile,
    Playlist,
  },
  universe,
  eventHandlers: {
    onNext,
    onPrevious,
    onTogglePlayback,
  },
}: {
  dependencies: {
    PlayerControl: () => JSX.Element;
    PlayerViewport: () => JSX.Element;
    playFile: (file: File | undefined) => void;
    Playlist: () => JSX.Element;
  };
  universe: {
    currentFile: () => File | undefined;
    playing: () => boolean;
  };
  eventHandlers: {
    onNext: EventHandler;
    onPrevious: EventHandler;
    onTogglePlayback: EventHandler;
  };
}) => {
  const store = new ViewerStore(universe.currentFile);
  const presenter = new ViewerPresenter(store);

  const Viewer = observer(() => (
    <ViewerImpl
      file={universe.currentFile()}
      mode={store.mode}
      onInteraction={presenter.handleInteraction}
      onNext={onNext}
      onPrevious={onPrevious}
      onRequestClose={() => playFile(undefined)}
      onToggleMode={presenter.toggleMode}
      onTogglePlayback={onTogglePlayback}
      onTogglePlaylist={presenter.togglePlaylist}
      PlayerControl={PlayerControl}
      PlayerViewport={PlayerViewport}
      playing={universe.playing()}
      Playlist={Playlist}
      showOverlay={store.showOverlay}
      showPlaylist={store.showPlaylist}
    />
  ));

  return {
    views: {
      Viewer,
    },
    state: {},
    actions: {},
    disposers: [],
  };
};

import {Densities, Themes} from 'component/App/config';
import {AppStore} from 'component/App/state';
import {App as AppImpl} from 'component/App/view';
import {observer} from 'mobx-react';
import React from 'react';

export const AppFactory = ({
  dependencies: {
    Browser,
    PlayerControl,
    Playlist,
    Viewer,
  },
  universe,
  eventHandlers,
}: {
  dependencies: {
    Browser: () => JSX.Element;
    PlayerControl: () => JSX.Element;
    Playlist: () => JSX.Element;
    Viewer: () => JSX.Element;
  },
  universe: {},
  eventHandlers: {},
}) => {
  const store = new AppStore();

  const App = observer(() =>
    <AppImpl
      themes={Themes}
      selectedTheme={store.selectedTheme}
      densities={Densities}
      selectedDensity={store.selectedDensity}

      Browser={Browser}
      PlayerControl={PlayerControl}
      Playlist={Playlist}
      Viewer={Viewer}
    />,
  );

  return {
    views: {
      App,
    },
    state: {},
    actions: {},
    disposers: [],
  };
};

import {Densities, Themes} from 'component/App/config';
import {AppStore} from 'component/App/state';
import {App as AppImpl} from 'component/App/view';
import {observer} from 'mobx-react';
import React from 'react';

export const AppFactory = ({
  dependencies: {
    List,
    PlayerControl,
    Playlist,
    Search,
  },
  universe,
  eventHandlers,
}: {
  dependencies: {
    List: () => JSX.Element;
    PlayerControl: () => JSX.Element;
    Playlist: () => JSX.Element;
    Search: () => JSX.Element;
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

      List={List}
      PlayerControl={PlayerControl}
      Playlist={Playlist}
      Search={Search}
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

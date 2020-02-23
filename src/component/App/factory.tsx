import {Densities, Themes} from 'component/App/config';
import {AppStore} from 'component/App/state';
import {App as AppImpl} from 'component/App/view';
import {observer} from 'mobx-react';
import * as React from 'react';

export interface AppDependencies {
  Libraries: () => JSX.Element;
  List: () => JSX.Element;
  Organiser: () => JSX.Element;
  Player: () => JSX.Element;
  Playlist: () => JSX.Element;
  Search: () => JSX.Element;
}

export const AppFactory = ({
  Libraries,
  List,
  Organiser,
  Player,
  Playlist,
  Search,
}: AppDependencies) => {
  const store = new AppStore();

  const App = observer(() =>
    <AppImpl
      themes={Themes}
      selectedTheme={store.selectedTheme}
      densities={Densities}
      selectedDensity={store.selectedDensity}

      Libraries={Libraries}
      List={List}
      Organiser={Organiser}
      Player={Player}
      Playlist={Playlist}
      Search={Search}
    />,
  );

  return {
    App,
  };
};

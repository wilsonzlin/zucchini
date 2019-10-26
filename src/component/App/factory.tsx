import {Densities, Themes} from "component/App/config";
import {AppStore} from "component/App/state";
import {App as AppImpl} from "component/App/view";
import {observer} from "mobx-react";
import * as React from "react";

export interface AppDependencies {
  Libraries: () => JSX.Element;
  Organiser: () => JSX.Element;
  Player: () => JSX.Element;
  Search: () => JSX.Element;
  Songs: () => JSX.Element;
}

export const AppFactory = (
  {
    Libraries,
    Organiser,
    Player,
    Search,
    Songs,
  }: AppDependencies
) => {
  const store = new AppStore();

  const App = observer(() =>
    <AppImpl
      themes={Themes}
      selectedTheme={store.selectedTheme}
      densities={Densities}
      selectedDensity={store.selectedDensity}

      Libraries={Libraries}
      Organiser={Organiser}
      Player={Player}
      Search={Search}
      Songs={Songs}
    />
  );

  return {
    App,
  };
};
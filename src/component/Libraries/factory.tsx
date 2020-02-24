import {LibrariesPresenter} from 'component/Libraries/presenter';
import {LibrariesState, LibrariesStore} from 'component/Libraries/state';
import {Libraries as LibrariesImpl} from 'component/Libraries/view';
import {observer} from 'mobx-react';
import React from 'react';

export const LibrariesFactory = () => {
  const store = new LibrariesStore();
  const presenter = new LibrariesPresenter(store);

  const Libraries = observer(() =>
    <LibrariesImpl
      libraries={store.libraries}
      selectedLibrary={store.selectedLibrary}

      onSelectLibrary={presenter.setSelectedLibrary}
    />,
  );

  return {
    Libraries,
    librariesState: new LibrariesState(store),
  };
};

import {callHandler, EventHandler} from 'common/Event';
import {Library} from 'component/Libraries/state';
import style from 'component/Libraries/style.scss';
import React from 'react';
import {Dropdown} from 'ui/Dropdown/view';

export const Libraries = ({
  libraries,
  selectedLibrary,
  onSelectLibrary,
}: {
  libraries: Library[];
  selectedLibrary?: Library;
  onSelectLibrary?: EventHandler<Library>;
}) => (
  <div className={style.libraries}>
    <Dropdown
      value={selectedLibrary}
      options={libraries.map(l => ({value: l, label: l.name}))}
      onChange={l => l && callHandler(onSelectLibrary, l)}
    />
  </div>
);

import {callHandler, EventHandler} from "common/Event";
import {Library} from "component/Libraries/state";
import * as style from "component/Libraries/style.scss";
import * as React from "react";
import {Dropdown} from "ui/Dropdown/view";

export const Libraries = (
  props: {
    libraries: Library[];
    selectedLibrary?: Library;

    onSelectLibrary?: EventHandler<Library>;
  }
) => (
  <div className={style.libraries}>
    <Dropdown
      value={props.selectedLibrary}
      options={props.libraries.map(l => ({value: l, label: l.name}))}
      onChange={l => l && callHandler(props.onSelectLibrary, l)}
    />
  </div>
);

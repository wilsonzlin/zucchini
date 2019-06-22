import {callOptionalHandler, EventHandler} from "../../common/Event";
import * as React from "react";

import "./Pane.scss";

export interface PaneEntryClickEvent {
  label: string;
  active: boolean;
}

export interface PaneEntryProps {
  hidden: boolean;
  label: string;
  active: boolean;

  onClick?: EventHandler<PaneEntryClickEvent>;
}

export class PaneEntry extends React.Component<PaneEntryProps> {
  constructor (props: PaneEntryProps) {
    super(props);
  }

  private handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
    callOptionalHandler(this.props.onClick, {label: this.props.label, active: this.props.active});
  };

  render () {
    return (
      <li className="pane-entry"
          data-hidden={this.props.hidden}
          onClick={this.handleClick}
      >{this.props.label}</li>
    );
  }
}

export interface PaneSearchEvent {
  term: string;
}

export interface PaneProps {
  entries: PaneEntryProps[];
  entriesType: string;

  onEntryClick?: EventHandler<PaneEntryClickEvent>;
  onSearch?: EventHandler<PaneSearchEvent>;
}

export class Pane extends React.Component<PaneProps> {
  constructor (props: PaneProps) {
    super(props);
  }

  private handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    callOptionalHandler(this.props.onSearch, {term: event.target.value.trim()});
  };

  render () {
    return (
      <aside id="pane">
        <input id="pane-search" placeholder="Search..." onInput={this.handleSearchInput}/>
        <nav id="pane-body">
          <ul id="pane-list" data-type={this.props.entriesType}>
            {this.props.entries.map(e => <PaneEntry onClick={this.props.onEntryClick} {...e}/>)}
          </ul>
        </nav>
      </aside>
    );
  }
}

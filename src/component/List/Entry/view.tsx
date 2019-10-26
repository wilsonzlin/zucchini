import {observable} from "mobx";
import {observer} from "mobx-react";
import {Field, Song} from "model/Song";
import * as React from "react";
import {cls} from "common/Classes";
import {callHandler, EventHandler} from "common/Event";
import commonStyle from "../common/style.scss";
import style from "./style.scss";

export interface ColumnDefinition<F extends Field> {
  field: F;
  label: string;
  width: number;
  align?: "left" | "center" | "right";
}

export interface ListEntryProps {
  song: Song;
  columns: ColumnDefinition<Field>[];

  onPlayTrack?: EventHandler<Song>;
}

@observer
export class ListEntry extends React.Component<ListEntryProps> {
  @observable private hoveringExceptOnLink: boolean = false;

  private handleMouseOver = (e: React.MouseEvent<HTMLElement>) => {
    this.hoveringExceptOnLink = (e.target as HTMLElement).tagName !== "A";
  };

  private handleMouseOut = () => {
    this.hoveringExceptOnLink = false;
  };

  private handleClick = () => {
    if (this.hoveringExceptOnLink) {
      callHandler(this.props.onPlayTrack, this.props.song);
    }
  };

  render () {
    const {song, columns} = this.props;
    return <tr
      className={cls({
        [style.entry]: true,
        [style.hovering]: this.hoveringExceptOnLink,
      })}
      onClick={this.handleClick}
      onMouseOver={this.handleMouseOver}
      onMouseOut={this.handleMouseOut}
    >
      {columns.map(c => <td
        key={c.field}
        className={commonStyle.cell}
        style={{textAlign: c.align}}
      >{(song[c.field])}</td>)}
    </tr>;
  }
}

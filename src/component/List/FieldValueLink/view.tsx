import * as React from "react";
import style from "./style.scss";

export interface LibraryFieldLinkProps {
  to: string;
  label: string;
}

export const LibraryFieldLink = (props: LibraryFieldLinkProps) => (
  <a className={style.libraryFieldLink} href={props.to}>{props.label}</a>
);

import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import "./Menu.scss";
import {Link} from "react-router-dom";

export interface MenuProps {

}

export const Menu = (props: MenuProps) => (
  <menu className="menu">
    <li>
      <Link to="/search"><FontAwesomeIcon icon={faSearch}/></Link>
    </li>
    <li>
      <Link to="/">Library</Link>
    </li>
    <li>
      <Link to="/genres">Genres</Link>
    </li>
    <li>
      <Link to="/artists">Artists</Link>
    </li>
    <li>
      <Link to="/albums">Albums</Link>
    </li>
    <li>
      <Link to="/decades">Decades</Link>
    </li>
  </menu>
);

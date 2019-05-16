import React from "react";
import { NavLink } from "react-router-dom";

export default function NavLinks() {
  return (
    <div className="nav-menu-container">
      <NavLink exact to="/">
        Friends
      </NavLink>
      <NavLink exact to="/personal">
        Personal
      </NavLink>
      <NavLink to="/profile/">Profile</NavLink>
    </div>
  );
}

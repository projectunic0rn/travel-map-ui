import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

export default function HamburgerMenuDropdown(props) {
  return (
    <div className={props.className} onClick={() => props.handleHamburgerClick(0)}>
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

HamburgerMenuDropdown.propTypes = {
  className: PropTypes.string,
  handleHamburgerClick: PropTypes.func
};
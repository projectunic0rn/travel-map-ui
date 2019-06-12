import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import HamburgerMenu from './HamburgerMenu';

export default function NavLinks(props) {
  function handleHamburgerClick(val) {
    props.handleHamburgerClick(val);
  }
  return (
    <div className="nav-menu-container">
      <NavLink exact to="/">
        Personal
      </NavLink>
      <NavLink exact to="/friends">
        Friends
      </NavLink>
      <NavLink to="/profile/">Profile</NavLink>
      <div className = 'nav-hamburger'>
        <HamburgerMenu handleHamburgerClick = {handleHamburgerClick} showHamburger = {props.showHamburgerDropdown}/>
      </div>
    </div>
  );
}

NavLinks.propTypes = {
  handleHamburgerClick: PropTypes.func, 
  showHamburgerDropdown: PropTypes.number
};
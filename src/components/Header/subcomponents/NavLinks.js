import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { NavLink, Link } from "react-router-dom";

export default function NavLinks({
  userLoggedIn,
  toggleFormIsOpen,
  formIsOpen
}) {
  if (userLoggedIn) {
    return (
      <Fragment>
        <NavLink exact to="/">
          Personal
        </NavLink>
        <NavLink exact to="/friends">
          Friends
        </NavLink>
        <NavLink exact to="/profile/">
          Profile
        </NavLink>
      </Fragment>
    );
  } else {
    return (
      <div>
        <Link
          to="#"
          onClick={toggleFormIsOpen}
          className={formIsOpen ? "active" : ""}
        >
          Login
        </Link>
      </div>
    );
  }
}
NavLinks.propTypes = {
  handleHamburgerClick: PropTypes.func,
  showHamburgerDropdown: PropTypes.number
};

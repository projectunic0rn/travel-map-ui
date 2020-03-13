import React from "react";
import PropTypes from "prop-types";
import { NavLink, Link } from "react-router-dom";
import { UserConsumer } from "../../../utils/UserContext";
import { prototype } from "supercluster";

export default function NavLinks({ toggleFormIsOpen, formIsOpen, handleHamburgerClick }) {
  return (
    <UserConsumer>
      {context => {
        if (context.userLoggedIn) {
          return (
            <>
              <NavLink onClick={() => handleHamburgerClick(0)} exact to="/">
                Personal
              </NavLink>
              <NavLink onClick={() => handleHamburgerClick(0)} exact to="/friends">
                Friends
              </NavLink>
              <NavLink onClick={() => handleHamburgerClick(0)} to="/profile/cities">Profile</NavLink>
              <span className="nav-secondary">
                <NavLink onClick={() => handleHamburgerClick(0)} to="/faq">FAQ</NavLink>
                <NavLink onClick={() => handleHamburgerClick(0)} to="/beta">Beta</NavLink>
              </span>
            </>
          );
        } else {
          return (
            <>
              <Link
                to="#"
                onClick={toggleFormIsOpen}
                className={formIsOpen ? "active" : ""}
              >
                Login
              </Link>
            </>
          );
        }
      }}
    </UserConsumer>
  );
}

NavLinks.propTypes = {
  toggleFormIsOpen: PropTypes.func,
  formIsOpen: PropTypes.bool, 
  handleHamburgerClick: PropTypes.func
};

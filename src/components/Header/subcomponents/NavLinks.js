import React from "react";
import PropTypes from "prop-types";
import { NavLink, Link } from "react-router-dom";
import { UserConsumer } from "../../../utils/UserContext";

export default function NavLinks({ toggleFormIsOpen, formIsOpen }) {
  function logoutClicked(setUserLoggedIn) {
    localStorage.removeItem("token");
    setUserLoggedIn(false);
  }
  return (
    <UserConsumer>
      {context => {
        if (context.userLoggedIn) {
          return (
            <>
              <NavLink exact to="/">
                Personal
              </NavLink>
              <NavLink exact to="/friends">
                Friends
              </NavLink>
              <NavLink to="/profile/cities">Profile</NavLink>
              <NavLink exact to="/faq">
                FAQ
              </NavLink>
              <NavLink exact to="/beta">
                Beta
              </NavLink>
              <NavLink
                to="/"
                id="logout-link-no-style"
                onClick={() => logoutClicked(context.setUserLoggedIn)}
              >
                Logout
              </NavLink>
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

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { NavLink, Link } from "react-router-dom";
import { UserConsumer } from "../../../utils/UserContext";

export default function NavLinks({ toggleFormIsOpen, formIsOpen }) {
  return (
    <UserConsumer>
      {(context) => {
        if (context.userLoggedIn) {
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
      }}
    </UserConsumer>
  );
}

NavLinks.propTypes = {
  toggleFormIsOpen: PropTypes.func,
  formIsOpen: PropTypes.bool
};

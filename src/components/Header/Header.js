import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

import NavLinks from "./subcomponents/NavLinks";
import SiteLogo from "./subcomponents/SiteLogo";
import SiteText from "../../icons/SiteText";
import LandingForm from "../../pages/Landing/subcomponents/LandingForm";
import UserHeaderContainer from "./subcomponents/UserHeaderContainer";
import { resolveFieldValueOrError } from "../../../node_modules/graphql/execution/execute";

export default function Header({ userLoggedIn, avatarIndex, color }) {
  let [showHamburgerDropdown, handleHamburgerClick] = useState(false);
  let [formIsOpen, setFormIsOpen] = useState(
    userLoggedIn || window.innerWidth < 1200 ? false : true
  );

  function filler({ som }) {}

  return (
    <Fragment>
      <header className="header-container">
        <div className="header-content">
          <div className="site-logo-container">
            <SiteLogo />
            <NavLink exact to="/">
              <span className="site-title">
                <SiteText />
              </span>
            </NavLink>
          </div>
          <div className="nav-menu-container">
            <NavLinks
              formIsOpen={formIsOpen}
              toggleFormIsOpen={setFormIsOpen}
              handleHamburgerClick={filler}
            />
            <div className="nav-hamburger">
              <div
                className={
                  showHamburgerDropdown
                    ? "hamburger-icon ham-active"
                    : "hamburger-icon"
                }
                id="ham"
                onClick={() => handleHamburgerClick(!showHamburgerDropdown)}
              >
                <span className="hamburger-a" />
                <span className="hamburger-b" />
              </div>
            </div>
            {formIsOpen ? <LandingForm setFormIsOpen={setFormIsOpen} /> : ""}
          </div>
          {userLoggedIn ? (
            <UserHeaderContainer color={color} avatarIndex={avatarIndex} />
          ) : null}
        </div>
      </header>
      <div
        className={
          showHamburgerDropdown
            ? "hamburger-dropdown-container"
            : "display-none"
        }
        onClick={() => handleHamburgerClick(!showHamburgerDropdown)}
      >
        <NavLinks
          formIsOpen={formIsOpen}
          toggleFormIsOpen={setFormIsOpen}
          handleHamburgerClick={handleHamburgerClick}
        />
      </div>
    </Fragment>
  );
}

Header.propTypes = {
  userLoggedIn: PropTypes.bool,
  setUserLoggedIn: PropTypes.func,
  color: PropTypes.string,
  avatarIndex: PropTypes.number,
};

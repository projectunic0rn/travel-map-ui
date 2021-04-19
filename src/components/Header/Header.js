import React, { Fragment, useState, useEffect, lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import NavLinks from "./subcomponents/NavLinks";
import SiteLogo from "./subcomponents/SiteLogo";
import SiteText from "../../icons/SiteText";
import UserHeaderContainer from "./subcomponents/UserHeaderContainer";

const LandingForm = lazy(() =>
  import("../../pages/Landing/subcomponents/LandingForm")
);

const Header = function Header({
  userLoggedIn,
  avatarIndex,
  color,
  setFormIsOpen,
  formIsOpen
}) {
  let [showHamburgerDropdown, handleHamburgerClick] = useState(false);

  function handleHamburgerClickHelper() {
    handleHamburgerClick(!showHamburgerDropdown);
  }

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
            />
            <div className="nav-hamburger">
              <div
                className={
                  showHamburgerDropdown
                    ? "hamburger-icon ham-active"
                    : "hamburger-icon"
                }
                id="ham"
                onClick={handleHamburgerClickHelper}
              >
                <span className="hamburger-a" />
                <span className="hamburger-b" />
              </div>
            </div>
            {formIsOpen ? (
              <Suspense fallback={<></>}>
                <LandingForm setFormIsOpen={setFormIsOpen} />
              </Suspense>
            ) : (
              ""
            )}
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
};

Header.propTypes = {
  userLoggedIn: PropTypes.bool,
  color: PropTypes.string,
  avatarIndex: PropTypes.number,
};

export default Header;

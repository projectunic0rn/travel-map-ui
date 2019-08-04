import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";

import NavLinks from "./subcomponents/NavLinks";
import SiteLogo from "./subcomponents/SiteLogo";
import LandingForm from "../../pages/Landing/subcomponents/LandingForm";
import UserHeaderContainer from "./subcomponents/UserHeaderContainer";

export default function Header({
  handleUserLogout,
  userLoggedIn,
  handleUserLogin
}) {
  let [showHamburgerDropdown, handleHamburgerClick] = useState(false);
  let [formIsOpen, setFormIsOpen] = useState(true);

  function handleHamburgerResponse(val) {
    handleHamburgerClick(val);
  }

  function toggleFormIsOpen() {
    setFormIsOpen(!formIsOpen);
  }
  return (
    <Fragment>
      <header className="header-container">
        <div className="header-content">
          <div className="site-logo-container">
            <SiteLogo />
            <span className="site-title">geornal</span>
          </div>
          <div className="nav-menu-container">
            <NavLinks
              userLoggedIn={userLoggedIn}
              formIsOpen={formIsOpen}
              toggleFormIsOpen={toggleFormIsOpen}
            />
            <div className="nav-hamburger">
              <div
                className={
                  showHamburgerDropdown
                    ? "hamburger-icon ham-active"
                    : "hamburger-icon"
                }
                id="ham"
                onClick={() => handleHamburgerResponse(!showHamburgerDropdown)}
              >
                <span className="hamburger-a" />
                <span className="hamburger-b" />
              </div>
            </div>
            {formIsOpen ? (
              <LandingForm
                setFormIsOpen={setFormIsOpen}
                handleUserLogin={handleUserLogin}
              />
            ) : (
              ""
            )}
          </div>
          {userLoggedIn ? <UserHeaderContainer handleUserLogout={handleUserLogout} /> : null}
        </div>
      </header>
      <div
        className={
          showHamburgerDropdown
            ? "hamburger-dropdown-container"
            : "display-none"
        }
      >
        <NavLinks
          userLoggedIn={userLoggedIn}
          formIsOpen={formIsOpen}
          toggleFormIsOpen={toggleFormIsOpen}
        />
      </div>
    </Fragment>
  );
}

Header.propTypes = {
  handleUserLogout: PropTypes.func,
  userLoggedIn: PropTypes.bool,
  handleUserLogin: PropTypes.func
};

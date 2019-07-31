import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";

import NavLinks from "./subcomponents/NavLinks";
import SiteLogo from "./subcomponents/SiteLogo";
import LandingForm from "../../pages/Landing/subcomponents/LandingForm";

export default function Header({ handleUserLogout, userLoggedIn }) {
  let [showHamburgerDropdown, handleHamburgerClick] = useState(false);
  let [formIsOpen, setFormIsOpen] = useState(false);

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
                handleUserLogin={() => console.log("Login pressed")}
              />
            ) : (
              ""
            )}
          </div>
          {/* <UserHeaderContainer handleUserLogout={handleUserLogout} /> */}
        </div>
      </header>
      <div
        className={
          showHamburgerDropdown
            ? "hamburger-dropdown-container"
            : "display-none"
        }
        // onClick={() => handleHamburgerResponse(false)}
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
  handleUserLogout: PropTypes.bool
};

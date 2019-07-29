import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import NavLinks from "./subcomponents/NavLinks";
import SiteLogo from "./subcomponents/SiteLogo";
import UserHeaderContainer from "./subcomponents/UserHeaderContainer";
import HamburgerMenuDropdown from "./subcomponents/HamburgerMenuDropdown";

export default function Header({ handleUserLogout }) {
  const [showHamburgerDropdown, handleHamburgerClick] = useState(0);

  function handleHamburgerResponse(val) {
    handleHamburgerClick(val);
  }
  return (
    <Fragment>
      <header className="header-container">
        <div className="header-content">
          <div className="site-logo-container">
            <SiteLogo />
            <span className="site-title">geornal</span>
          </div>
          <NavLinks
            handleHamburgerClick={handleHamburgerResponse}
            showHamburgerDropdown={showHamburgerDropdown}
          />
          {/* <UserHeaderContainer handleUserLogout={handleUserLogout} /> */}
        </div>
      </header>
      <HamburgerMenuDropdown
        className={
          showHamburgerDropdown
            ? "hamburger-dropdown-container"
            : "display-none"
        }
        handleHamburgerClick={handleHamburgerResponse}
      />
    </Fragment>
  );
}

Header.propTypes = {
  handleUserLogout: PropTypes.func
};

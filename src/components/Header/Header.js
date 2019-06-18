import React from "react";
import PropTypes from 'prop-types';
import NavLinks from "./subcomponents/NavLinks";
import SiteLogo from "./subcomponents/SiteLogo";
import UserHeaderContainer from "./subcomponents/UserHeaderContainer";

export default function Header(props) {
  function handleHamburgerResponse(val) {
    props.handleHamburgerClick(val);
  }
  return (
    <header className="header-container">
      <div className="header-content">
        <div className="site-logo-container">
          <SiteLogo />
          <span className="site-title">Site name</span>
        </div>
        <NavLinks handleHamburgerClick = {handleHamburgerResponse} showHamburgerDropdown = {props.showHamburgerDropdown}/>
        <UserHeaderContainer handleUserLogout={props.handleUserLogout} />
      </div>
    </header>
  );
}

Header.propTypes = {
  handleHamburgerClick: PropTypes.func, 
  showHamburgerDropdown: PropTypes.number,
  handleUserLogout: PropTypes.func
}
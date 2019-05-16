import React from 'react';
import NavLinks from './subcomponents/NavLinks';
import SiteLogo from './subcomponents/SiteLogo';
import UserHeaderContainer from './subcomponents/UserHeaderContainer';


export default function Header() {
  return (
    <header className="header-container">
      <div className="header-content">
        <div className = 'site-logo-container'>
          <SiteLogo />
          <span className = 'site-title'>
            Site name
          </span>
        </div>
        <NavLinks />
        <UserHeaderContainer />
      </div>
    </header>
  );
}

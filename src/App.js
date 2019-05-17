import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Landing from './pages/Landing/Landing';
import Profile from './pages/Profile/Profile';
import HamburgerMenuDropdown from "./components/Header/subcomponents/HamburgerMenuDropdown";

import './App.scss';

const { useState } = React;

function App() {
  const [showHamburgerDropdown, handleHamburgerClick] = useState(0);
  const [userLoggedIn, handleUserLogin] = useState(0);
  function handleHamburgerResponse(val) {
    handleHamburgerClick(val);
  }

  if (!userLoggedIn) {
    return (
      <Landing handleUserLogin={handleUserLogin}/>
    )
  }

  return (
    <Router>
      <Header handleHamburgerClick = {handleHamburgerResponse} showHamburgerDropdown = {showHamburgerDropdown}/>
      <HamburgerMenuDropdown
        className={showHamburgerDropdown ? "hamburger-dropdown-container" : "display-none"}
        handleHamburgerClick = {handleHamburgerResponse}
      />
      <Route path="/" exact component={Home} />
      {/* TODO: highlight trips when visiting /profile? or redirect /profile page to /profile/trips or use /profile/trips here instead */}
      <Route path="/profile/" component={Profile} />
    </Router>
  );
}

App.propTypes = {
  foo: PropTypes.string,
};

export default App;

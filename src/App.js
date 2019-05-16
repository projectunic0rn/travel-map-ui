import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Nav from './components/Nav/Nav';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';

import './App.scss';

function App() {
  return (
    <Router>
      <Nav />
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

import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Nav from './Nav';
import Home from './Home';
import Page2 from './Page2';

function App() {
  return (
    <Router>
      <Nav />
      <Route path="/" exact component={Home} />
      <Route path="/page2/" component={Page2} />
    </Router>
  );
}

App.propTypes = {
  foo: PropTypes.string,
};

export default App;

import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Landing from "./pages/Landing/Landing";
import MapPage from "./pages/Home/MapPage";
import Profile from "./pages/Profile/Profile";
import HamburgerMenuDropdown from "./components/Header/subcomponents/HamburgerMenuDropdown";
import "./_App.scss";
import socket from "./socket";

const { useState } = React;

function App() {
  const [showHamburgerDropdown, handleHamburgerClick] = useState(0);
  const [userLoggedIn, handleUserLogin] = useState(1);
  function handleHamburgerResponse(val) {
    handleHamburgerClick(val);
  }
  function handleUserLoggingIn(val) {
    handleUserLogin(val);
  }

  if (!userLoggedIn) {
    return (
      <Router>
        <Landing handleUserLogin={handleUserLoggingIn} />
      </Router>
    );
  }
  socket.on('new-friend-request', (data) => {
    alert(data.senderData.username + " has sent you a friend request!")
  })

  socket.on('new-trip', (username) => {
    alert(username + " has created a new trip!")
  });

  return (
    <Router>
      <Header
        handleHamburgerClick={handleHamburgerResponse}
        showHamburgerDropdown={showHamburgerDropdown}
        handleUserLogout={handleUserLoggingIn}
      />
      <HamburgerMenuDropdown
        className={
          showHamburgerDropdown
            ? "hamburger-dropdown-container"
            : "display-none"
        }
        handleHamburgerClick={handleHamburgerResponse}
      />
      <Route path="/" exact component={MapPage} />
      {/* TODO: highlight trips when visiting /profile? or redirect /profile page to /profile/trips or use /profile/trips here instead */}
      <Route path="/profile/" component={Profile} />
    </Router>
  );
}

export default App;

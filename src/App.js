import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Landing from "./pages/Landing/Landing";
import MapPage from "./pages/Home/MapPage";
import Profile from "./pages/Profile/Profile";
import "./_App.scss";
import socket from "./socket";

function App() {
  const [userLoggedIn, handleUserLogin] = useState(0);

  function handleUserLoggingIn(val) {
    handleUserLogin(val);
  }

  if (!userLoggedIn) {
    return (
      <Router>
        <Header />
        <Landing handleUserLogin={handleUserLoggingIn} />
      </Router>
    );
  }
  socket.on("new-friend-request", (data) => {
    alert(data.senderData.username + " has sent you a friend request!");
  });

  socket.on("trip-created", (username) => {
    alert(username + " has created a new trip!");
  });

  return (
    <Router>
      <Header handleUserLogout={handleUserLoggingIn} />
      <Route path="/" exact component={MapPage} />
      {/* TODO: highlight trips when visiting /profile? or redirect /profile page to /profile/trips or use /profile/trips here instead */}
      <Route path="/profile/" component={Profile} />
    </Router>
  );
}

export default App;

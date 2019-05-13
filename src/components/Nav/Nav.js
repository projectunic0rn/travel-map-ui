import React from 'react';
import { NavLink } from 'react-router-dom';
import UserAvatar from '../UserAvatar/UserAvatar';

export default function Nav() {
  return (
    <nav className="main-nav">
      <div className="container">
        <ul className="left-side">
          <NavLink exact to="/">Home</NavLink>
          <NavLink exact to="/profile/">Profile Page</NavLink>
        </ul>
        <span className="logo">LOGO</span>
        <span className="right-side">
          <a href="#" className="user-link">
            <span className="user-username">Username</span>
            <UserAvatar />
          </a>
        </span>
      </div>
    </nav>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="main-nav">
      <div className="container">
        <ul className="left-side">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li className="selected">
            <Link to="/profile/">Profile Page</Link>
          </li>
        </ul>
        <span className="logo">LOGO</span>
        <span className="right-side">
          <a href="#">Username then img</a>
        </span>
      </div>
    </nav>
  );
}

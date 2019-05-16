import React from 'react';
import { NavLink } from 'react-router-dom';

export default function ProfileNav() {
  return (
    <div className="content content-nav">
      <NavLink to="/profile/trips">Trips</NavLink>
      <NavLink to="/profile/media">Media</NavLink>
      <NavLink to="/profile/friends">Friends</NavLink>
      <NavLink to="/profile/settings">Settings</NavLink>
    </div>
  )
}
import React from 'react';
import { Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import ProfileNav from './ProfileNav';
import Trips from './subpages/Trips';
import Media from './subpages/Media';
import Friends from './subpages/Friends';
import Settings from './subpages/Settings';

export default function Profile() {
  return (
    <div className="page page-profile">
      <div className="container">
        <Sidebar />
        <ProfileNav />
        <Route path="/profile/" exact component={Trips} />
        <Route path="/profile/trips" exact component={Trips} />
        <Route path="/profile/media" exact component={Media} />
        <Route path="/profile/friends" exact component={Friends} />
        <Route path="/profile/settings" exact component={Settings} />
      </div>
    </div>
  );
}

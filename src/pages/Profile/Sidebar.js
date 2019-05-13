import React from 'react';
import UserAvatar from '../../components/UserAvatar/UserAvatar';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <UserAvatar />
      <div className="user-details-block">
        <div className="user-name-age">
          <span className="user-username">Username123</span>
          <span className="seperator">, </span>
          <span className="user-age">24</span>
        </div>
        <div className="user-location">
          <span className="city">City</span>
          <span className="seperator">, </span>
          <span className="country">Country</span>
        </div>
      </div>
      <div className="user-activity-block">
        <div className="activity-block">
          <span className="count">4</span>
          <span className="label">Friends</span>
        </div>
        <div className="activity-block">
          <span className="count">8</span>
          <span className="label">Countries</span>
        </div>
        <div className="activity-block">
          <span className="count">24</span>
            <span className="label">Cities</span>
        </div>
      </div>
      <div className="user-tags">
        <span className="tag tag-green">Nature Lover</span>
        <span className="tag tag-blue">Like a Local</span>
        <span className="tag tag-yellow">Foodie</span>
        <span className="tag tag-red">Historian</span>
      </div>
    </div>
  )
}
import React from "react";
import PropTypes from "prop-types";

import UserAvatar from '../../../UserAvatar/UserAvatar';

function UserTripCard(props) {
  console.log(props);
  return (
    <div className="user-trip-card">
      <div className="user-profile-image"><UserAvatar avatarIndex = {props.trip.avatarIndex} color = {props.trip.color} /></div>
      <div className="utc-user-info-container">
        <span className="utc-username">{props.trip.username}</span>
        <span className="utc-duration">
          {props.metricValue} {props.metric}
        </span>
      </div>
      <div
        className={
          "utc-year-container utc-year-container-" + props.trip.tripTiming
        }
      >
        <p />
      </div>
    </div>
  );
}

UserTripCard.propTypes = {
  trip: PropTypes.object,
  metricValue: PropTypes.number,
  metric: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default UserTripCard;

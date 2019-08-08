import React from "react";
import PropTypes from "prop-types";

function UserTripCard(props) {
  return (
    <div className="user-trip-card">
      <div className="user-profile-image" />
      <div className="utc-user-info-container">
        <span className="utc-username">{props.trip.username}</span>
        <span className="utc-duration">{props.metricValue} {props.metric}</span>
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
  metric: PropTypes.string
};

export default UserTripCard;

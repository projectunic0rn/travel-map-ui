import React from "react";
import PropTypes from "prop-types";

function UserTripCard(props) {
  return (
    <div className="user-trip-card">
      <div className="user-profile-image" />
      <div className="utc-user-info-container">
        <span className="utc-username">{props.cityTrip.username}</span>
        <span className="utc-duration"># days</span>
      </div>
      <div
        className={
          "utc-year-container utc-year-container-" + props.cityTrip.tripTiming
        }
      >
        <p />
      </div>
    </div>
  );
}

UserTripCard.propTypes = {
  cityTrip: PropTypes.object
};

export default UserTripCard;
